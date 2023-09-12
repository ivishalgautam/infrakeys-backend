const { pool } = require("../config/db");

async function getDashboardDetails(req, res) {
  try {
    const { rows } = await pool.query(`SELECT 
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM sub_categories) as total_sub_categories,
    (SELECT COUNT(*) FROM users WHERE role = 'user') as total_users,
    (SELECT COUNT(*) FROM product_queries) as total_product_queries,
    (SELECT COUNT(*) FROM banners) as total_banners`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getUserDetails(req, res) {
  const userId = parseInt(req.params.userId);
  try {
    const resp = await pool.query(
      `
    SELECT
          u.*, p.*
      FROM
          product_queries AS pq
      INNER JOIN
          products AS p ON pq.product_id = p.id
      INNER JOIN
          users AS u ON pq.user_id = u.id
      WHERE u.id = $1;
    `,
      [userId]
    );
    res.json(resp.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getDashboardDetails, getUserDetails };
