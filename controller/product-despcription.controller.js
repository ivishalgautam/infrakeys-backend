const { pool } = require("../config/db");

async function createProductDescription(req, res) {
  // console.log(req.file);
  const { descriptions, product_id } = req.body;
  try {
    let rows = [];
    for (const record of descriptions) {
      const description = await pool.query(
        `INSERT INTO product_descriptions (description, product_id) VALUES ($1, $2) RETURNING *`,
        [record, product_id]
      );
      rows.push(description.rows[0]);
    }

    res.json({
      message: "Descriptions added successfully",
      descriptions: rows,
    });
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateProductDescriptionById(req, res) {
  const productDescriptionId = parseInt(req.params.productDescriptionId);
  const { data } = req.body;
  // const updateColumns = Object.keys(data)
  //   .map((column, key) => `${column} = $${key + 1}`)
  //   .join(", ");
  // const updateValues = Object.values(data);
  try {
    let rows = [];
    for (const { id, description } of data) {
      const desc = await pool.query(
        `UPDATE product_descriptions SET description = $1 WHERE id = $2 returning *`,
        [description, id]
      );
      rows.push(desc.rows[0]);
    }

    if (rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Product description not found!" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
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
