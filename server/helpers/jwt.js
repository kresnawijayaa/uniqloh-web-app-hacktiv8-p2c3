const jwt = require("jsonwebtoken");

const jwt_secret = process.env.JWT_SECRET || "lion_king";

function generateToken(payload) {
  console.log(process.env.JWT_SECRET, "asdioasjodjasodj");
  return jwt.sign(payload, jwt_secret);
}

function decodeToken(token) {
  console.log(process.env.JWT_SECRET, "asdioasjodjasodj");
  return jwt.verify(token, jwt_secret);
}

module.exports = { generateToken, decodeToken };
