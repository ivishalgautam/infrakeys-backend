const { pool } = require("../config/db");

async function createProductApplication(req, res) {
  const { applications, product_id } = req.body;
  try {
    let rows = [];
    for (const record of applications) {
      const application = await pool.query(
        `INSERT INTO product_applications (application, product_id) VALUES ($1, $2) returning *`,
        [record, product_id]
      );
      rows.push(application.rows[0]);
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getProductApplications(req, res) {
  const productId = parseInt(req.params.productId);
  try {
    const { rows } = await pool.query(
      `SELECT * FROM product_applications WHERE product_id = $1`,
      [productId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getProductApplicationById(req, res) {
  const productApplicationId = parseInt(req.params.productApplicationId);
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM product_applications WHERE id = $1`,
      [productApplicationId]
    );

    if (rowCount === 0)
      return res
        .status(404)
        .json({ message: "Product application not found!" });

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function deleteProductApplicationById(req, res) {
  const productApplicationId = parseInt(req.params.productApplicationId);
  try {
    const productApplication = await pool.query(
      `DELETE FROM product_applications WHERE id = $1`,
      [productApplicationId]
    );

    if (productApplication.rowCount === 0)
      return res
        .status(404)
        .json({ message: "Product application not found!" });

    res.json({ message: "Product application deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateProductApplicationById(req, res) {
  const productApplicationId = parseInt(req.params.productApplicationId);
  const { ...data } = req.body;
  const updateColumns = Object.keys(data)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(data);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE product_applications SET ${updateColumns} WHERE id = ${
        updateValues.length + 1
      } returning *`,
      [...updateValues, productApplicationId]
    );
    if (rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Product application not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProductApplication,
  getProductApplications,
  getProductApplicationById,
  deleteProductApplicationById,
  updateProductApplicationById,
};
