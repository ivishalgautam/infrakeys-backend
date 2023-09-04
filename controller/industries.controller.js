const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createIndustry(req, res) {
  const { title } = req.body;
  try {
    const files = {
      filename: req.file.originalname,
      path: `/assets/categories/industries/${req.file.filename}`,
    };
    const { rows } = await pool.query(
      `INSERT INTO industries (title, image) VALUES ($1, $2) returning *`,
      [title, files.path]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getIndustries(req, res) {
  try {
    const { rows } = await pool.query(`SELECT * FROM industries`);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getIndustryById(req, res) {
  const industryId = parseInt(req.params.industryId);
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM industries WHERE id = $1`,
      [industryId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Industry not found!" });

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function deleteIndustryById(req, res) {
  const industryId = parseInt(req.params.industryId);
  try {
    const productUsedByExist = await pool.query(
      `SELECT * FROM industries WHERE id = $1`,
      [industryId]
    );

    if (productUsedByExist.rowCount === 0)
      return res.status(404).json({ message: "Industry not found!" });

    const fileName = path.basename(productUsedByExist.rows[0].image);
    const filePath = path.join(
      __dirname,
      "../assets/categories/industries",
      fileName
    );

    await pool.query(`DELETE FROM industries WHERE id = $1 returning *`, [
      industryId,
    ]);

    fs.unlinkSync(filePath);
    res.json({ message: "Industry deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateIndustryById(req, res) {
  const industryId = parseInt(req.params.industryId);
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
      [...updateValues, industryId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Industry not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
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
