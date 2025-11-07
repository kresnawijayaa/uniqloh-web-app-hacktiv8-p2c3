// Seed using raw SQL (pg) from JSON files
const path = require('path');
const fs = require('fs');
const { query } = require('../db');
const { hashPassword } = require('../helpers/hash');
require('dotenv').config();

function readJSON(rel) {
  const p = path.join(__dirname, '..', rel);
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

async function run() {
  // Users
  const users = readJSON('data/users.json').map(u => ({
    ...u,
    password: hashPassword(u.password)
  }));
  for (const u of users) {
    await query(
      `INSERT INTO users (username, email, password, role, "phoneNumber", address, "createdAt","updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW())
       ON CONFLICT (email) DO NOTHING`,
      [u.username, u.email, u.password, u.role || 'Admin', u.phoneNumber || null, u.address || null]
    );
  }

  // Categories
  const categories = readJSON('data/categories.json');
  for (const c of categories) {
    await query(
      `INSERT INTO categories (name, "createdAt","updatedAt")
       VALUES ($1,NOW(),NOW())
       ON CONFLICT DO NOTHING`,
      [c.name]
    );
  }

  // Products
  const products = readJSON('data/products.json');
  for (const p of products) {
    await query(
      `INSERT INTO products (name, description, price, stock, "imgUrl", "categoryId", "authorId", status, "createdAt","updatedAt")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW())
       ON CONFLICT DO NOTHING`,
      [p.name, p.description, p.price, p.stock, p.imgUrl, p.categoryId, p.authorId, p.status || 'Active']
    );
  }

  console.log('Seed done.');
}

run().catch(e => { console.error(e); process.exit(1); });
