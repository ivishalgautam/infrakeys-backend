const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createCategory(req, res) {
  const { name } = req.body;
  try {
    const files = {
      filename: req.file.originalname,
      path: `/${req.file.filename}`,
    };
    const { rows, rowCount } = await pool.query(
      `INSERT INTO categories (name, image_url) VALUES ($1, $2) returning *`,
      [name, files.path]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteCategoryById(req, res) {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const categoryExist = await pool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [categoryId]
    );

    if (categoryExist.rowCount === 0)
      return res.status(404).json({ message: "banner not found!" });

    const fileName = path.basename(categoryExist.rows[0].image_url);
    const filePath = path.join(__dirname, "../assets/categories", fileName);

    await pool.query(`DELETE FROM categories WHERE id = $1);`, [categoryId]);

    fs.unlinkSync(filePath);
    res.json({ message: "Category deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateCategoryById(req, res) {
  const categoryId = parseInt(req.params.categoryId);
  const { ...categoryData } = req.body;
  const updateColumns = Object.keys(categoryData)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(categoryData);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE categories SET ${updateColumns} WHERE id = ${
        updateValues.length + 1
      } returning *`,
      [...updateValues, categoryId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Category not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCategories(req, res) {
  try {
    const { rows, rowCount } = await pool.query(`SELECT * FROM categories`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getCategoryById(req, res) {
  const categoryId = parseInt(req.params.categoryId);
  try {
    const { rows, rowCount } = await pool.query(
      `SELECT * FROM categories WHERE id = $1`,
      [categoryId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Category not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createCategory,
  deleteCategoryById,
  updateCategoryById,
  getCategories,
  getCategoryById,
};
