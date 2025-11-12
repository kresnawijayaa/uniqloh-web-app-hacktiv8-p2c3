const { query } = require('../db');
const { checkPassword, hashPassword } = require("../helpers/hash");
const { generateToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

class PubAuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const hashed = hashPassword(password);
      const { rows } = await query(
        `INSERT INTO customers (username, email, password, "createdAt","updatedAt")
         VALUES ($1,$2,$3,NOW(),NOW()) RETURNING id, username, email`,
         [username, email, hashed]
      );
      res.status(201).json(rows[0]);
    } catch (error) { next(error); }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { rows } = await query(`SELECT * FROM customers WHERE email=$1`, [email]);
      console.log(rows, "<< ini res")
      const customer = rows[0];
      if (!customer || !checkPassword(password, customer.password)) return res.status(401).json({ message:'Invalid email or password' });
      const access_token = generateToken({ id: customer.id, email: customer.email, role: 'customer' });
      res.status(200).json({ access_token, email: customer.email });
    } catch (error) { next(error); }
  }

  static async googleLogin(req, res, next) {
    try {
      const { google_token } = req.headers;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      let { rows } = await query(`SELECT * FROM customers WHERE email=$1`, [payload.email]);
      let customer = rows[0];
      if (!customer) {
        const ins = await query(
          `INSERT INTO customers (username, email, password, "createdAt","updatedAt")
           VALUES ($1,$2,$3,NOW(),NOW()) RETURNING *`,
          [payload.name || payload.email.split('@')[0], payload.email, hashPassword(Math.random().toString(36).slice(2))]
        );
        customer = ins.rows[0];
      }
      const access_token = generateToken({ id: customer.id, email: customer.email, role: 'customer' });
      res.status(200).json({ access_token, email: customer.email });
    } catch (error) { next(error); }
  }
}


class PubProductsController {
  // GET /pub/products?page=1&size=9&search=...&sort=name|-name|price|-price&category=1,2
  static async read(req, res, next) {
    try {
      // ---- parse query
      const page  = Math.max(parseInt(req.query.page ?? 1, 10), 1);
      const size  = Math.max(parseInt(req.query.size ?? 9, 10), 1);
      const search = (req.query.search ?? "").trim();
      const sort   = (req.query.sort ?? "").trim();

      // terima 'category' (1,2,3) atau legacy 'categoryId'
      const rawCategory = (req.query.category ?? req.query.categoryId ?? "").toString().trim();
      const catIds = rawCategory
        ? rawCategory.split(",").map((x) => parseInt(x, 10)).filter(Boolean)
        : [];

      // ---- build WHERE
      const conds = [];
      const params = [];
      let i = 1;

      if (search) {
        conds.push(`(p.name ILIKE $${i})`);
        params.push(`%${search}%`);
        i++;
      }
      if (catIds.length) {
        conds.push(`p."categoryId" = ANY($${i})`);
        params.push(catIds);
        i++;
      }

      const whereSql = conds.length ? `WHERE ${conds.join(" AND ")}` : "";

      // ---- ORDER BY
      let orderBy = `p.id ASC`;
      if (sort === "name") orderBy = `p.name ASC`;
      else if (sort === "-name") orderBy = `p.name DESC`;
      else if (sort === "price") orderBy = `p.price ASC`;
      else if (sort === "-price") orderBy = `p.price DESC`;

      // ---- pagination
      const offset = (page - 1) * size;

      const sql = `
        SELECT p.id, p.name, p.price, p.stock, p."imgUrl", p.status, c.name AS category_name
        FROM products p
        JOIN categories c ON c.id = p."categoryId"
        ${whereSql}
        ORDER BY ${orderBy}
        LIMIT $${i} OFFSET $${i + 1}
      `;

      const { rows } = await query(sql, [...params, size, offset]);

      // (opsional) total rows untuk future: kirim di header
      // const { rows: cnt } = await query(
      //   `SELECT COUNT(*)::int AS total FROM products p ${whereSql}`, params
      // );
      // res.set("X-Total-Count", cnt[0]?.total ?? 0);

      res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const id = Number(req.params.id);
      const { rows } = await query(
        `SELECT * FROM products WHERE id = $1`,
        [id]
      );
      if (!rows[0]) return res.status(404).json({ message: "Product not found" });
      res.status(200).json(rows[0]);
    } catch (error) {
      next(error);
    }
  }
}

class PubFavoritesController {
  // GET /pub/favorites
  static async read(req, res, next) {
    try {
      const customerId = req.user.id;
      const { rows } = await query(
        `
        SELECT
          p.id                             AS "id",
          p.name                           AS "name",
          p.price                          AS "price",
          p."imgUrl"                       AS "imgUrl",
          f.id                             AS "favoriteId",
          f."createdAt"                    AS "favoritedAt"
        FROM favorites f
        JOIN products  p ON p.id = f."ProductId"
        WHERE f."CustomerId" = $1
        ORDER BY f.id DESC
        `,
        [customerId]
      );
      res.status(200).json(rows); // FE bisa langsung render: product.id, name, price, imgUrl
    } catch (error) { next(error); }
  }

  // POST /pub/favorites/:id  (ADD, idempotent)
  static async add(req, res, next) {
    try {
      const customerId = req.user.id;
      const productId  = Number(req.params.id);

      // opsional: pastikan produk exist
      // const check = await query(`SELECT 1 FROM products WHERE id=$1`, [productId]);
      // if (!check.rowCount) return res.status(404).json({message: "Product not found"});

      // idempotent add
      const insert = await query(
        `
        INSERT INTO favorites ("ProductId","CustomerId","createdAt","updatedAt")
        VALUES ($1,$2,NOW(),NOW())
        ON CONFLICT ("CustomerId","ProductId") DO NOTHING
        RETURNING id
        `,
        [productId, customerId]
      );

      // sinkron: kembalikan status & snapshot produk
      const { rows } = await query(
        `
        SELECT
          p.id   AS "id",
          p.name AS "name",
          p.price AS "price",
          p."imgUrl" AS "imgUrl"
        FROM products p WHERE p.id=$1
        `,
        [productId]
      );

      res.status(insert.rowCount ? 201 : 200).json({
        ok: true,
        action: insert.rowCount ? "added" : "exists",
        product: rows[0] || null,
      });
    } catch (error) { next(error); }
  }

  // DELETE /pub/favorites/:id  (REMOVE)
  static async remove(req, res, next) {
    try {
      const customerId = req.user.id;
      const productId  = Number(req.params.id);

      const del = await query(
        `DELETE FROM favorites WHERE "CustomerId"=$1 AND "ProductId"=$2 RETURNING id`,
        [customerId, productId]
      );

      res.status(200).json({ ok: true, action: del.rowCount ? "removed" : "not_found" });
    } catch (error) { next(error); }
  }

  // (opsional) POST /pub/favorites/:id/toggle
  static async toggle(req, res, next) {
    try {
      const customerId = req.user.id;
      const productId  = Number(req.params.id);

      // jika ada → hapus, kalau tidak ada → insert
      const exists = await query(
        `SELECT 1 FROM favorites WHERE "CustomerId"=$1 AND "ProductId"=$2`,
        [customerId, productId]
      );

      if (exists.rowCount) {
        await query(`DELETE FROM favorites WHERE "CustomerId"=$1 AND "ProductId"=$2`, [customerId, productId]);
        return res.status(200).json({ ok: true, action: "removed" });
      } else {
        await query(
          `INSERT INTO favorites ("ProductId","CustomerId","createdAt","updatedAt") VALUES ($1,$2,NOW(),NOW())`,
          [productId, customerId]
        );
        return res.status(201).json({ ok: true, action: "added" });
      }
    } catch (error) { next(error); }
  }
}

class PubCategoriesController {
  static async read(req, res, next) {
    try {
      const { rows } = await query(`SELECT id, name FROM categories ORDER BY id ASC`);
      res.status(200).json(rows);
    } catch (error) { next(error); }
  }
}

module.exports = {
  PubAuthController,
  PubProductsController,
  PubFavoritesController,
  PubCategoriesController,
};
