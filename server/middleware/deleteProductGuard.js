// server/middleware/deleteProductGuard.js
const { query } = require("../db");

const deleteProductGuard = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const { rows } = await query(`SELECT * FROM products WHERE id = $1`, [productId]);
    const product = rows[0];
    if (!product) {
      throw { name: "NotFound", message: `Product with id ${productId} not found` };
    }

    const role = (req.user?.role || "").toLowerCase();
    if (role === "staff") {
      if (product.authorId === req.user.id) {
        req.product = product;
        return next();
      } else {
        throw { name: "Forbidden", message: "Forbidden Access" };
      }
    }

    // Admin / role lain: boleh
    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = deleteProductGuard;
