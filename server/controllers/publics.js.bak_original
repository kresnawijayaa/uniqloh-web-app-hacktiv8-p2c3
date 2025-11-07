const { User, Category, Product, Customer, Favorite } = require("../models");
const { checkPassword } = require("../helpers/hash");
const { generateToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");
const { Op } = require("sequelize");
const axios = require("axios");

class PubAuthController {
  static async googleLogin(req, res, next) {
    try {
      const { google_token } = req.headers;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const [customer, created] = await Customer.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          username: payload.name,
          email: payload.email,
          role: "customer",
          password: "saya-mengakui-kresna-ganteng",
        },
      });
      const access_token = generateToken({
        id: customer.id,
      });

      const fixUser = user || created;
      delete fixUser.password;
      res.status(200).json({
        access_token,
        user: {
          id: fixUser.id,
          username: fixUser.username,
          email: fixUser.email,
          role: fixUser.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      const role = "customer";
      const { username, email, password } = req.body;
      if (!email) {
        throw { status: 400, message: "Email is required" };
      }
      if (!password) {
        throw { status: 400, message: "Password is required" };
      }
      const newCustomer = await Customer.create({
        username,
        email,
        password,
        role,
      });
      res.status(201).json({ id: newCustomer.id, email: newCustomer.email });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    if (!email) {
      throw { status: 400, message: "Email is required" };
    }
    if (!password) {
      throw { status: 400, message: "Password is required" };
    }
    try {
      const customer = await Customer.findOne({
        where: {
          email,
        },
      });
      if (!customer) {
        throw {
          status: 401,
          message: "Invalid email or password",
        };
      }
      const isPasswordValid = checkPassword(password, customer.password);
      if (!isPasswordValid) {
        throw {
          status: 401,
          message: "Invalid email or password",
        };
      }
      const accessToken = generateToken({
        id: customer.id,
        email,
      });

      res.status(200).json({
        access_token: accessToken,
        user: {
          id: customer.id,
          username: customer.username,
          email: customer.email,
          role: customer.role,
        },
      });
      console.log(customer.username, "LOGIN CEK DISINI<<<");
    } catch (error) {
      next(error);
    }
  }
}

class PubProductsController {
  static async read(req, res, next) {
    const { search, filter, sort, page } = req.query;

    const paramQuerySQL = {};
    let limit = 9;
    let offset;

    // filtering by search
    if (search !== "" && typeof search !== "undefined") {
      paramQuerySQL.where = { name: { [Op.iLike]: `%${search}%` } };
    }

    // filtering by category
    if (filter !== "" && typeof filter !== "undefined") {
      console.log(filter, "CEK FILTER NIH <<<<<");
      const query = filter.category.split(",").map((item) => ({
        [Op.eq]: item,
      }));

      if (!paramQuerySQL.where) {
        paramQuerySQL.where = {};
      }

      paramQuerySQL.where.categoryId = { [Op.or]: query };
    }

    console.log(paramQuerySQL, "DISNINIII <<<<<<<");

    // sorting
    if (sort !== "" && typeof sort !== "undefined") {
      let query;
      if (sort.charAt(0) !== "-") {
        query = [[sort, "ASC"]];
      } else {
        query = [[sort.replace("-", ""), "DESC"]];
      }

      paramQuerySQL.order = query;
    }

    // pagination
    if (page !== "" && typeof page !== "undefined") {
      if (page.size !== "" && typeof page.size !== "undefined") {
        limit = page.size;
        paramQuerySQL.limit = limit;
      }

      if (page.number !== "" && typeof page.number !== "undefined") {
        offset = page.number * limit - limit;
        paramQuerySQL.offset = offset;
      }
    }
    // paramQuerySQL.where = { status: "Active" };
    try {
      const products = await Product.findAll(paramQuerySQL);

      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  static async detail(req, res, next) {
    const { id } = req.params;

    try {
      console.log(id, "<<<XXX");
      const product = await Product.findByPk(id);
      if (!product) {
        throw { name: "NotFound" };
      }

      const apiKey = `Fkeuze6ZT99jWWFoy0z3CrGS0gHM3Q9S789X9YlGX36mATSgmAAXXLzwtIwUfs4j`;
      const url = `https://api.qr-code-generator.com/v1/create`;

      const response = await axios({
        method: "get",
        url: url,
        params: {
          "access-token": apiKey,
          qr_code_text:
            "https://uniqloh-site.web.app/products/" + req.params.id,
          image_format: "SVG",
        },
      });

      const newProduct = product.toJSON();
      newProduct.qr = response.data;

      res.status(200).json(newProduct);
    } catch (error) {
      next(error);
    }
  }
}

class PubFavoritesController {
  static async read(req, res, next) {
    const CustomerId = req.customer.id;
    try {
      const favorites = await Favorite.findAll({
        where: { CustomerId },
        include: {
          model: Product,
        },
      });
      if (!favorites) {
        throw { name: "NotFound" };
      }

      res.status(200).json(favorites);
    } catch (error) {
      next(error);
    }
  }

  static async add(req, res, next) {
    try {
      const ProductId = req.params.id;
      const CustomerId = req.customer.id;
      const productFound = await Product.findByPk(ProductId);
      if (!productFound) {
        throw { name: "NotFound" };
      }
      const favorites = await Favorite.findAll({
        where: { CustomerId },
        include: {
          model: Product,
        },
      });

      favorites.map((x) => {
        if (x.Product.id === productFound.id) {
          throw { status: 500, message: "Already in favorites" };
        }
      });

      const newFavorite = await Favorite.create({ ProductId, CustomerId });
      res.status(201).json(newFavorite);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

class PubCategoriesController {
  static async read(req, res, next) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  PubAuthController,
  PubProductsController,
  PubFavoritesController,
  PubCategoriesController,
};
