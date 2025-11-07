// Apply schema.sql using pg
const fs = require('fs');
const path = require('path');
const { query } = require('../db');
require('dotenv').config();

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'schema.sql'), 'utf-8');
  await query(sql);
  console.log('Schema applied.');
}
run().catch(e => { console.error(e); process.exit(1); });
