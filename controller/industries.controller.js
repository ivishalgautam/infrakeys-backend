const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createIndustry(req, res) {
  const { title, product_id } = req.body;
  try {
    const files = {
      filename: req.file.originalname,
      path: `/${req.file.filename}`,
    };
    const { rows } = await pool.query(
      `INSERT INTO industries (title, image, product_id) VALUES ($1, $2, $3) returning *`,
      [title, files.path, product_id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getIndustries(req, res) {
  const productId = parseInt(req.params.productId);
  try {
    const { rows } = await pool.query(`SELECT * FROM industries`, [productId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getIndustryById(req, res) {
  const productUsedById = parseInt(req.params.productUsedById);
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM industries WHERE id = $1`,
      [productUsedById]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Product used by not found!" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteIndustryById(req, res) {
  const productUsedById = parseInt(req.params.productUsedById);
  try {
    const productUsedByExist = await pool.query(
      `SELECT * FROM industries WHERE id = $1`,
      [productUsedById]
    );

    if (productUsedByExist.rowCount === 0)
      return res.status(404).json({ message: "Product used by not found!" });

    const fileName = path.basename(productUsedByExist.rows[0].image);
    const filePath = path.join(
      __dirname,
      "../assets/product-used-by",
      fileName
    );

    await pool.query(`DELETE FROM industries WHERE id = $1 returning *`, [
      productUsedById,
    ]);

    fs.unlinkSync(filePath);
    res.json({ message: "Product used by deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateIndustryById(req, res) {
  const productUsedById = parseInt(req.params.productUsedById);
  const { ...data } = req.body;
  const updateColumns = Object.keys(data)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(data);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE industries SET ${updateColumns} WHERE id = ${
        updateValues.length + 1
      } returning *`,
      [...updateValues, productUsedById]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Product used by not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createIndustry,
  getIndustries,
  getIndustryById,
  deleteIndustryById,
  updateIndustryById,
};
