const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createBanner(req, res) {
  console.log(req.file);
  const { name, link } = req.body;
  try {
    const files = {
      filename: req.file.originalname,
      path: `/${req.file.filename}`,
    };

    const { rows } = await pool.query(
      `INSERT INTO banners (name, banner_url, link) VALUES ($1, $2, $3) returning *`,
      [name, files.path, link]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBanners(req, res) {
  try {
    const { rows } = await pool.query(`SELECT * FROM banners`);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getBannerById(req, res) {
  const bannerId = parseInt(req.params.bannerId);
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM banners WHERE id = $1`,
      [bannerId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Banner not found!" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteBannerById(req, res) {
  const bannerId = parseInt(req.params.bannerId);
  try {
    const bannerExist = await pool.query(
      `SELECT * FROM banners WHERE id = $1`,
      [bannerId]
    );

    if (bannerExist.rowCount === 0)
      return res.status(404).json({ message: "banner not found!" });

    const fileName = path.basename(bannerExist.rows[0].banner_url);
    const filePath = path.join(__dirname, "../assets/banners", fileName);

    await pool.query(`DELETE FROM banners WHERE id = $1 returning *`, [
      bannerId,
    ]);

    fs.unlinkSync(filePath);
    res.json({ message: "Banner deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateBannerById(req, res) {
  const bannerId = parseInt(req.params.bannerId);
  const { ...bannerData } = req.body;
  const updateColumns = Object.keys(bannerData)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(bannerData);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE banners SET ${updateColumns} WHERE id = ${
        updateValues.length + 1
      } returning *`,
      [...updateValues, bannerId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Banner not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createBanner,
  getBanners,
  deleteBannerById,
  getBannerById,
  updateBannerById,
};
