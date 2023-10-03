const { decodeToken } = require("../helpers/jwt");
const { User } = require("../models");

const authentication = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw {
        name: "InvalidJWT",
        message: "Invalid token",
      };
    }
    const data = decodeToken(access_token);

    const user = await User.findByPk(data.id);
    if (!user) {
      throw {
        name: "Unauthorized",
        message: "User Not Found",
      };
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
