const mysql = require("mysql2/promise");
require("dotenv").config();

// Connection pool — reused across requests instead of opening a new
// connection every time (much faster under load)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick sanity check on startup so connection issues fail loudly
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("MySQL connected successfully.");
    conn.release();
  } catch (err) {
    console.error("MySQL connection failed:", err.message);
  }
}

module.exports = { pool, testConnection };
