const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createSubCategory(req, res) {
  const { name, category_id } = req.body;
  // console.log(first)
  try {
    const files = {
      filename: req.file.originalname,
      path: `/${req.file.filename}`,
    };
    const { rows, rowCount } = await pool.query(
      `INSERT INTO categories (name, image_url, category_id) VALUES ($1, $2, $3) returning *`,
      [name, files.path, parseInt(category_id)]
    );
    res.json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteSubCategoryById(req, res) {
  const subCategoryId = parseInt(req.params.subCategoryId);
  try {
    const subCategoryExist = await pool.query(
      `SELECT * FROM sub_categories WHERE id = $1`,
      [subCategoryId]
    );

    if (subCategoryExist.rowCount === 0)
      return res.status(404).json({ message: "banner not found!" });

    const fileName = path.basename(subCategoryExist.rows[0].image_url);
    const filePath = path.join(__dirname, "../assets/sub-categories", fileName);

    await pool.query(`DELETE FROM categories WHERE id = $1 returning *`, [
      subCategoryId,
    ]);

    fs.unlinkSync(filePath);
    res.json({ message: "Sub category deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateSubCategoryById(req, res) {
  const subCategoryId = parseInt(req.params.subCategoryId);
  const { ...subCategoryData } = req.body;
  const updateColumns = Object.keys(subCategoryData)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(subCategoryData);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE sub_categories SET ${updateColumns} WHERE id = ${
        updateValues.length + 1
      } returning *`,
      [...updateValues, subCategoryId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Sub category not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSubCategories(req, res) {
  try {
    const { rows, rowCount } = await pool.query(`SELECT * FROM sub_categories`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getSubCategoryById(req, res) {
  const subCategoryId = parseInt(req.params.subCategoryId);
  try {
    const { rows, rowCount } = await pool.query(
      `SELECT * FROM sub_categories WHERE id = $1`,
      [subCategoryId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "sub category not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createSubCategory,
  deleteSubCategoryById,
  updateSubCategoryById,
  getSubCategories,
  getSubCategoryById,
};
