const { query } = require('../db');

class CategoriesController {
  static async read(req, res, next) {
    try {
      const { rows } = await query(
        `SELECT id, name, "createdAt", "updatedAt" FROM categories ORDER BY id ASC`
      );
      res.status(200).json(rows);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriesController;
