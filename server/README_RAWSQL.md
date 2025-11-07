# Raw SQL migration (Complete)

Semua controller telah diubah ke raw SQL (pg). Struktur tambahan:

- `server/db/index.js` → Pool PG + helper `query()` / `tx()`
- `server/sql/schema.sql` → definisi schema (lowercase)
- `server/scripts/init_schema.js` → apply schema
- `server/scripts/seed_raw.js` → seed dari `server/data/*.json`

## Cara jalan
```
cd server
npm i pg dotenv

# .env
PGHOST=202.10.41.134
PGPORT=5432
PGUSER=kresna
PGPASSWORD=postgres
PGDATABASE=uniqloh-db

node scripts/init_schema.js
node scripts/seed_raw.js

npm start
```
