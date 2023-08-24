const { pool } = require("../config/db");

async function createProductFeature(req, res) {
  const { features, product_id } = req.body;
  try {
    let rows = [];
    for (const record of features) {
      const feature = await pool.query(
        `INSERT INTO product_features (title, feature, product_id) VALUES ($1, $2, $3) returning *`,
        [record.title, record.feature, product_id]
      );
      rows.push(feature.rows[0]);
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductFeatures(req, res) {
  const productId = parseInt(req.params.productId);
  try {
    const { rows } = await pool.query(
      `SELECT * FROM product_features WHERE product_id = $1`,
      [productId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductFeatureById(req, res) {
  const productFeatureId = parseInt(req.params.productFeatureId);
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM product_features WHERE id = $1`,
      [productFeatureId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Product feature not found!" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteProductFeatureById(req, res) {
  const productFeatureId = parseInt(req.params.productFeatureId);
  try {
    const productFeature = await pool.query(
      `DELETE FROM product_features WHERE id = $1`,
      [productFeatureId]
    );

    if (productFeature.rowCount === 0)
      return res.status(404).json({ message: "Product feature not found!" });

    res.json({ message: "Product feature deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProductFeatureById(req, res) {
  const productFeatureId = parseInt(req.params.productFeatureId);
  const { ...data } = req.body;
  const updateColumns = Object.keys(data)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(data);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE product_features SET ${updateColumns} WHERE id = ${
        updateValues.length + 1
      } returning *`,
      [...updateValues, productFeatureId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Product feature not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProductFeature,
  getProductFeatures,
  getProductFeatureById,
  deleteProductFeatureById,
  updateProductFeatureById,
};
