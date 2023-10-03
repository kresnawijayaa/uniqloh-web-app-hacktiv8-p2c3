module.exports = {
  apps : [{
    name   : "app1",
    script : "./app.js",
env: {
	NODE_ENV: "production",
	PORT: 80,
	DATABASE_URL: "postgresql://postgres:HCK_61_CONSOLE.LOG@db.wxdieeaueuzjdvxdwirj.supabase.co:5432/postgres",
	JWT_SECRET: "cc092f0b8bc51474ab5b1da59d5049fccb5514ab70cde3e29428d97eb4270db0",
	GOOGLE_CLIENT_ID: "509678468230-6tb116lc4sivi16u4ob4joga0n3kqkdm.apps.googleusercontent.com"
     }
  }]
}
