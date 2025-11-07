const { query } = require('../db');
const { checkPassword, hashPassword } = require("../helpers/hash");
const { generateToken } = require("../helpers/jwt");
const { OAuth2Client } = require("google-auth-library");

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password, role, phoneNumber, address } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required" });
      if (!password) return res.status(400).json({ message: "Password is required" });
      const hashed = hashPassword(password);
      const sql = `INSERT INTO users (username, email, password, role, "phoneNumber", address, "createdAt", "updatedAt")
                   VALUES ($1,$2,$3,$4,$5,$6, NOW(), NOW())
                   RETURNING id, username, email, role, "phoneNumber", address`;
      const params = [username || null, email, hashed, role || 'Admin', phoneNumber || null, address || null];
      const { rows } = await query(sql, params);
      res.status(201).json(rows[0]);
    } catch (error) { next(error); }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { rows } = await query(`SELECT * FROM users WHERE email = $1`, [email]);
      const user = rows[0];
      if (!user || !checkPassword(password, user.password)) throw { name: "NotAuthenticated" };
      const access_token = generateToken({ id: user.id, email: user.email });
      res.status(200).json({ access_token, email: user.email });
    } catch (error) { next(error); }
  }

  static async googleLogin(req, res, next) {
    try {
      const { google_token } = req.headers;
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const email = payload.email;
      let { rows } = await query(`SELECT * FROM users WHERE email = $1`, [email]);
      let user = rows[0];
      if (!user) {
        const ins = await query(
          `INSERT INTO users (username, email, password, role, "createdAt","updatedAt")
           VALUES ($1,$2,$3,$4,NOW(),NOW()) RETURNING *`,
          [payload.name || email.split('@')[0], email, hashPassword(Math.random().toString(36).slice(2)), 'Staff']
        );
        user = ins.rows[0];
      }
      const access_token = generateToken({ id: user.id, email: user.email });
      res.status(200).json({ access_token, email: user.email });
    } catch (error) { next(error); }
  }
}

module.exports = AuthController;
