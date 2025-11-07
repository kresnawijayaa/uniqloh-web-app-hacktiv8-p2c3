// server/middleware/authenticationCustomer.js
const { decodeToken } = require("../helpers/jwt");
const { query } = require("../db");

const authenticationCustomer = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    const token = bearer || req.headers.access_token;
    if (!token) throw { name: "InvalidJWT", message: "Invalid token" };

    const payload = decodeToken(token); // { id, email, ... }
    const { rows } = await query(
      `SELECT id, email, username FROM customers WHERE id = $1`,
      [payload.id]
    );
    const customer = rows[0];
    if (!customer) {
      throw { name: "Unauthorized", message: "Customer not found" };
    }

    // konsisten: pakai req.user untuk publik
    req.user = { id: customer.id, email: customer.email, role: "customer" };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticationCustomer;
