const { Product } = require("../models");

const statusProductGuard = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId);
    if (!product) {
      throw {
        name: "NotFound",
        message: `Product with id ${productId} not found`,
      };
    }
    if (req.user.role === "staff") {
      if (product.authorId === req.user.id) {
        req.product = product;
        next();
      } else {
        throw {
          name: "Forbidden",
          message: "Forbidden Access",
        };
      }
    } else {
      req.product = product;
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = statusProductGuard;
