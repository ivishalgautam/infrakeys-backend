const { pool } = require("../config/db");
const fs = require("fs");

async function create(req, res) {
  const { category } = req.body;

  if (!category) return res.status(400).json({ message: "no category found." });

  try {
    const { rows } = await pool.query(
      `INSERT INTO blogs_category (category) VALUES ($1) returning *`,
      [category]
    );
    res.send(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function get(req, res) {
  try {
    const { rows } = await pool.query(`SELECT * FROM blogs_category;`);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function deleteById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM blogs_category WHERE id = $1`,
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ message: "blog category not found!" });
    }

    res.json({ message: "blog deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  create,
  get,
  deleteById,
};
