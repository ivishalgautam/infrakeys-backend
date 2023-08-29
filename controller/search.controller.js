const { pool } = require("../config/db");
async function search(req, res) {
  const query = req.query.q;
  try {
    const { rows } = await pool.query(
      `SELECT * FROM products WHERE title ILIKE $1;`,
      [`%${query}%`]
    );
    res.json(rows); // Log the rows to see the result
  } catch (error) {
    console.error(error);
  }
}

module.exports = { search };
