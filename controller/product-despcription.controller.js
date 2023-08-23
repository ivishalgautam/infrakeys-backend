const { pool } = require("../config/db");

async function createProductDescription(req, res) {
  console.log(req.file);
  const { descriptions, product_id } = req.body;
  try {
    let rows = [];
    for (const record of descriptions) {
      const sector = await pool.query(
        `INSERT INTO departments (description, product_id) VALUES ($1, $2) RETURNING *`,
        [record, product_id]
      );
      rows.push(sector.rows[0]);
    }

    res.json({
      message: "Descriptions added successfully",
      descriptions: rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductDescriptions(req, res) {
  const productId = parseInt(req.params.productId);
  try {
    const { rows } = await pool.query(
      `SELECT * FROM product_descriptions WHERE product_id = $1`,
      [productId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductDescriptionById(req, res) {
  const productDescriptionId = parseInt(req.params.productDescriptionId);
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM product_descriptions WHERE id = $1`,
      [productDescriptionId]
    );

    if (rowCount === 0)
      return res
        .status(404)
        .json({ message: "Product description not found!" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteProductDescriptionById(req, res) {
  const productDescriptionId = parseInt(req.params.productDescriptionId);
  try {
    const productDescription = await pool.query(
      `DELETE FROM product_descriptions WHERE id = $1`,
      [productDescriptionId]
    );

    if (productDescription.rowCount === 0)
      return res
        .status(404)
        .json({ message: "Product description not found!" });

    res.json({ message: "Product description deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProductDescriptionById(req, res) {
  const productDescriptionId = parseInt(req.params.productDescriptionId);
  const { ...data } = req.body;
  const updateColumns = Object.keys(data)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(data);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE product_descriptions SET ${updateColumns} WHERE id = ${
        updateValues.length + 1
      } returning *`,
      [...updateValues, productDescriptionId]
    );
    if (rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Product description not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProductDescription,
  getProductDescriptions,
  getProductDescriptionById,
  deleteProductDescriptionById,
  updateProductDescriptionById,
};
