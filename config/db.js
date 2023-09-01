require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

// Handle connection errors
pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err);
  process.exit(-1); // Exit the application or handle the error gracefully
});

module.exports = { pool };

// const pgp = require("pg-promise")();

// const dbConfig = {
//   host: process.env.HOST, // Your PostgreSQL host
//   port: process.env.DB_PORT, // Your PostgreSQL port
//   database: process.env.DATABASE,
//   user: process.env.USER,
//   password: process.env.PASSWORD,
// };

// const db = pgp(dbConfig);

// module.exports = db;
