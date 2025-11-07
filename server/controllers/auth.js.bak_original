const { User, Category, Product } = require("../models");
const { checkPassword } = require("../helpers/hash");
const { generateToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

class AuthController {
  static async googleLogin(req, res, next) {
    try {
      const { google_token } = req.headers;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          username: payload.name,
          email: payload.email,
          role: "staff",
          password: "saya-mengakui-kresna-ganteng",
        },
        hooks: false,
      });
      const access_token = generateToken({
        id: user.id,
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
          phoneNumber: fixUser.phoneNumber,
          address: fixUser.address,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async register(req, res, next) {
    try {
      req.body.role = "admin";
      const newUser = await User.create(req.body);
      res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw { name: "NotAuthenticated" };
      }
      const isPasswordValid = checkPassword(password, user.password);
      if (!isPasswordValid) {
        throw { name: "NotAuthenticated" };
      }
      const accessToken = generateToken({
        id: user.id,
        email,
      });

      res.status(200).json({
        access_token: accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
