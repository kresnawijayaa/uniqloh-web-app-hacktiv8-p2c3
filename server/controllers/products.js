const { User, Category, Product, History } = require("../models");

class ProductsController {
  static async read(req, res, next) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
          },
          {
            model: User,
          },
        ],
        order: [["id", "ASC"]],
      });
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async createForm(req, res, next) {
    try {
      const category = await Category.findAll();
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, description, price, stock, imgUrl, categoryId } = req.body;
      const authorId = req.user.id;
      const status = "Active";

      const newProduct = await Product.create({
        name,
        description,
        price,
        stock,
        imgUrl,
        categoryId,
        authorId,
        status,
      });

      await res.status(201).json(newProduct);

      const descHistory = `Product with id ${newProduct.id} created`;
      const updatedBy = req.user.email;
      await History.create({
        name,
        description: descHistory,
        updatedBy,
      });
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    try {
      const productFound = await Product.findByPk(req.params.id);
      if (!productFound) {
        throw { name: "NotFound" };
      }
      res.status(200).json(productFound);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const productFound = await Product.findByPk(req.params.id);
      if (!productFound) {
        throw { name: "NotFound" };
      }
      await Product.destroy({
        where: { id: req.params.id },
      });
      res.status(200).json({
        message: `${productFound.name} success to delete`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params;
      const productFound = await Product.findByPk(id);
      const { name, description, price, stock, imgUrl, categoryId } = req.body;
      const authorId = productFound.authorId;
      // test
      await Product.update(
        {
          name,
          description,
          price,
          stock,
          imgUrl,
          categoryId,
          authorId,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(201).json(`Product with id ${id} updated`);

      const descHistory = `Product with id ${id} updated`;
      const updatedBy = req.user.email;
      await History.create({
        name,
        description: descHistory,
        updatedBy,
      });
    } catch (error) {
      next(error);
    }
  }

  static async status(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const oldStatus = req.product.status;
      const authorId = req.user.id;

      await Product.update({ status }, { where: { id } });
      // console.log(id, oldStatus, status, "<<<");
      res
        .status(201)
        .json(
          `Product status with id ${id} has been updated from ${oldStatus} into ${status}`
        );

      const descHistory = `Product status with id ${id} has been updated from ${oldStatus} into ${status}`;
      const updatedBy = req.user.email;
      await History.create({
        name: req.product.name,
        description: descHistory,
        updatedBy,
      });
    } catch (error) {
      next(error);
    }
  }

  static async history(req, res, next) {
    try {
      const listHistory = await History.findAll({
        order: [["id", "DESC"]],
      });
      // const updatedByName = req.user.name
      // console.log(listHistory, "DISINIIIII<<<");
      res.status(200).json(listHistory);
    } catch (error) {
      // console.log(error, "<<<<<<<<<<<<<<<<<>>>>>>>>>>>");
      next(error);
    }
  }
}

module.exports = ProductsController;
