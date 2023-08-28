const { pool } = require("../config/db");

async function getDashboardDetails(req, res) {
  try {
    const { rows } = await pool.query(`SELECT 
    (SELECT COUNT(*) FROM products) as total_products,
    (SELECT COUNT(*) FROM categories) as total_categories,
    (SELECT COUNT(*) FROM sub_categories) as total_sub_categories,
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM product_queries) as total_product_queries,
    (SELECT COUNT(*) FROM banners) as total_banners`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { getDashboardDetails };
