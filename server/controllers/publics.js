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
  static async read(req, res, next) {
    try {
      const { search, categoryId } = req.query;
      let sql = `SELECT p.id, p.name, p.price, p.stock, p."imgUrl", p.status, c.name AS category_name
                 FROM products p JOIN categories c ON c.id=p."categoryId"`;
      const params = [];
      const conds = [];
      if (search) { params.push(`%${search}%`); conds.push(`p.name ILIKE $${params.length}`); }
      if (categoryId) { params.push(categoryId); conds.push(`p."categoryId" = $${params.length}`); }
      if (conds.length) sql += ' WHERE ' + conds.join(' AND ');
      sql += ' ORDER BY p.id ASC';
      const { rows } = await query(sql, params);
      res.status(200).json(rows);
    } catch (error) { next(error); }
  }

  static async detail(req, res, next) {
    try {
      const id = req.params.id;
      const { rows } = await query(`SELECT * FROM products WHERE id=$1`, [id]);
      if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(rows[0]);
    } catch (error) { next(error); }
  }
}

class PubFavoritesController {
  static async read(req, res, next) {
    try {
      const customerId = req.user.id;
      const { rows } = await query(
        `SELECT f.id, f."ProductId", p.name, p.price, p."imgUrl", f."createdAt"
         FROM favorites f JOIN products p ON p.id = f."ProductId"
         WHERE f."CustomerId"=$1 ORDER BY f.id DESC`, [customerId]);
      res.status(200).json(rows);
    } catch (error) { next(error); }
  }

  static async add(req, res, next) {
    try {
      const customerId = req.user.id;
      const productId = req.params.id;
      const { rows } = await query(
        `INSERT INTO favorites ("ProductId","CustomerId","createdAt","updatedAt")
         VALUES ($1,$2,NOW(),NOW()) RETURNING *`, [productId, customerId]);
      res.status(201).json(rows[0]);
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
