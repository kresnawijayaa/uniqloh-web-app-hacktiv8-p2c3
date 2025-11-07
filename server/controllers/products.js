const { query } = require('../db');

class ProductsController {
  static async read(req, res, next) {
    try {
      const sql = `SELECT p.id, p.name, p.description, p.price, p.stock, p."imgUrl", p.status,
                          p."categoryId", c.name AS category_name,
                          p."authorId", u.email AS author_email,
                          p."createdAt", p."updatedAt"
                   FROM products p
                   JOIN categories c ON c.id = p."categoryId"
                   JOIN users u ON u.id = p."authorId"
                   ORDER BY p.id ASC`;
      const { rows } = await query(sql);
      res.status(200).json(rows);
    } catch (error) { next(error); }
  }

  static async createForm(req, res, next) {
    try {
      const { rows } = await query(`SELECT id, name FROM categories ORDER BY id ASC`);
      res.status(200).json(rows);
    } catch (error) { next(error); }
  }

  static async create(req, res, next) {
    try {
      const { name, description, price, stock, imgUrl, categoryId, status } = req.body;
      const authorId = req.user?.id;
      const sql = `INSERT INTO products (name, description, price, stock, "imgUrl", "categoryId", "authorId", status, "createdAt","updatedAt")
                   VALUES ($1,$2,$3,$4,$5,$6,$7, COALESCE($8,'Active'), NOW(), NOW())
                   RETURNING *`;
      const params = [name, description, price, stock, imgUrl, categoryId, authorId, status];
      const { rows } = await query(sql, params);
      const newProduct = rows[0];
      res.status(201).json(newProduct);

      const desc = `Product with id ${newProduct.id} created`;
      await query(`INSERT INTO histories (name, description, "updatedBy", "createdAt","updatedAt")
                   VALUES ($1,$2,$3,NOW(),NOW())`,
                   [newProduct.name, desc, req.user?.email || 'system']);
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

  static async delete(req, res, next) {
    try {
      const id = req.params.id;
      const del = await query(`DELETE FROM products WHERE id=$1`, [id]);
      if (!del.rowCount) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(`Product with id ${id} deleted`);
      await query(`INSERT INTO histories (name, description, "updatedBy", "createdAt","updatedAt")
                   VALUES ($1,$2,$3,NOW(),NOW())`,
                   [String(id), `Product with id ${id} deleted`, req.user?.email || 'system']);
    } catch (error) { next(error); }
  }

  static async edit(req, res, next) {
    try {
      const id = req.params.id;
      const { name, description, price, stock, imgUrl, categoryId, authorId } = req.body;
      const { rows } = await query(
        `UPDATE products
         SET name=$1, description=$2, price=$3, stock=$4, "imgUrl"=$5, "categoryId"=$6, "authorId"=COALESCE($7,"authorId"), "updatedAt"=NOW()
         WHERE id=$8
         RETURNING *`,
         [name, description, price, stock, imgUrl, categoryId, authorId, id]
      );
      if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
      res.status(201).json(`Product with id ${id} updated`);
      await query(`INSERT INTO histories (name, description, "updatedBy", "createdAt","updatedAt")
                   VALUES ($1,$2,$3,NOW(),NOW())`,
                   [rows[0].name, `Product with id ${id} updated`, req.user?.email || 'system']);
    } catch (error) { next(error); }
  }

  static async status(req, res, next) {
    try {
      const id = req.params.id;
      const { status } = req.body;
      const { rows } = await query(`UPDATE products SET status=$1, "updatedAt"=NOW() WHERE id=$2 RETURNING *`, [status, id]);
      if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
      res.status(200).json(`Product status with id ${id} has been updated into ${status}`);
      await query(`INSERT INTO histories (name, description, "updatedBy", "createdAt","updatedAt")
                   VALUES ($1,$2,$3,NOW(),NOW())`,
                   [rows[0].name, `Product status with id ${id} has been updated into ${status}`, req.user?.email || 'system']);
    } catch (error) { next(error); }
  }

  static async history(req, res, next) {
    try {
      const { rows } = await query(`SELECT * FROM histories ORDER BY id DESC`);
      res.status(200).json(rows);
    } catch (error) { next(error); }
  }
}

module.exports = ProductsController;
