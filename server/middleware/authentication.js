// server/middleware/authentication.js
const { decodeToken } = require("../helpers/jwt");
const { query } = require("../db");

const authentication = async (req, res, next) => {
  try {
    // Ambil token dari Authorization: Bearer xxx ATAU header access_token
    const auth = req.headers.authorization || "";
    const bearer = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    const token = bearer || req.headers.access_token;

    if (!token) {
      throw { name: "InvalidJWT", message: "Invalid token" };
    }

    const payload = decodeToken(token); // { id, email, ... }
    const { rows } = await query(
      `SELECT id, email, role, username FROM users WHERE id = $1`,
      [payload.id]
    );
    const user = rows[0];
    if (!user) {
      throw { name: "Unauthorized", message: "User Not Found" };
    }

    req.user = user; // { id, email, role, username }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authentication;
