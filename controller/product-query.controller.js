const { pool } = require("../config/db");

async function createQuery(req, res) {
  const { userId, productId } = req.body;
  try {
    const userExist = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userExist.rowCount === 0)
      return res.status(401).json({ message: "Unauthorized!" });

    const query = await pool.query(
      `INSERT INTO product_queries (user_id, product_id) VALUES ($1, $2)`,
      [userId, productId]
    );
    res.json({ message: "Your query has been sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function deleteQueryByUserId(req, res) {
  const userId = parseInt(req.params.userId);
  try {
    const userExist = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userExist.rowCount === 0)
      return res.status(401).json({ message: "Unauthorized!" });

    const query = await pool.query(
      `DELETE FROM product_queries WHERE id = $1`,
      [userId]
    );
    res.json({ message: "Your query has been deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getAllQueries(req, res) {
  try {
    const { rows } = await pool.query(`SELECT * FROM product_queries;`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getUserQueries(req, res) {
  const userId = parseInt(req.params.userId);

  try {
    const { rows } = await pool.query(
      `SELECT p.*
            FROM product_queries vp
            JOIN products p ON vp.product_id = p.id
            WHERE vp.user_id = $1;`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createQuery,
  deleteQueryByUserId,
  getAllQueries,
  getUserQueries,
};
