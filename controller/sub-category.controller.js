const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createSubCategory(req, res) {
  const { name, category_id } = req.body;
  console.log(req.body, req.file);
  try {
    const files = {
      filename: req.file.originalname,
      path: `/assets/categories/sub-categories/${req.file.filename}`,
    };
    const { rows, rowCount } = await pool.query(
      `INSERT INTO sub_categories (name, image_url, category_id) VALUES ($1, $2, $3) returning *`,
      [name, files.path, parseInt(category_id)]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
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
      return res.status(404).json({ message: "Sub category not found!" });

    const fileName = path.basename(subCategoryExist.rows[0].image_url);
    const filePath = path.join(
      __dirname,
      "../assets/categories/sub-categories",
      fileName
    );

    await pool.query(`DELETE FROM sub_categories WHERE id = $1;`, [
      subCategoryId,
    ]);

    fs.unlinkSync(filePath);
    res.json({ message: "Sub category deleted successfully." });
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getSubCategories(req, res) {
  try {
    const { rows } = await pool.query(`
        SELECT 
          sc.id, 
          sc.name, 
          sc.image_url, 
          sc.slug
          c.name AS category_name, 
          c.id as category_id
        FROM sub_categories AS sc
        JOIN categories AS c ON sc.category_id = c.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
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
    res.json(rows);
  } catch (error) {
    console.error(error);
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
