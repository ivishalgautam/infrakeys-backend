const { pool } = require("../config/db");

async function createQuery(req, res) {
  const { userId, productId } = req.body;
  const timestamp = new Date();
  try {
    const userExist = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      userId,
    ]);

    if (userExist.rowCount === 0)
      return res.status(401).json({ message: "Unauthorized!" });

    if (!userExist.rows[0].verified)
      return res.status(400).json({ message: "Please verify your account!" });
    const queryExist = await pool.query(`SELECT * FROM product_queries;`);

    for (const data of queryExist.rows) {
      if (data.user_id === userId && data.product_id === productId) {
        console.log(data);
        return res.json({ message: "You already queried this product." });
      }
    }

    const query = await pool.query(
      `INSERT INTO product_queries (user_id, product_id, timestamp) VALUES ($1, $2, $3)`,
      [userId, productId, timestamp]
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

async function getUserQueries(req, res) {
  const userId = parseInt(req.params.userId);

  try {
    const { rows } = await pool.query(
      `SELECT p.*, pq.timestamp
            FROM product_queries pq
            JOIN products p ON pq.product_id = p.id
            WHERE pq.user_id = $1;`,
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getAllQueries(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT
          pq.id AS query_id,
          p.title as product_name,
          u.fullname as user_name,
          u.id as user_id,
          pq.timestamp
      FROM
          product_queries AS pq
      INNER JOIN
          products AS p ON pq.product_id = p.id
      INNER JOIN
          users AS u ON pq.user_id = u.id;`
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
