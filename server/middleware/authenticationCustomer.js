const { decodeToken } = require("../helpers/jwt");
const { Customer } = require("../models");

const authenticationCustomer = async (req, res, next) => {
  try {
    const { access_token } = req.headers;

    const data = decodeToken(access_token);

    const customer = await Customer.findByPk(data.id);
    if (!customer) {
      throw {
        name: "Unauthorized",
        message: "Customer not found",
      };
    }
    req.customer = customer;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticationCustomer;
