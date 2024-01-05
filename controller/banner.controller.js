const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createBanner(req, res) {
  const { name, category_id } = req.body;
  try {
    // const banners = req.file.map((banner) => `/${banner.filename}`);
    // console.log(req.file);
    // console.log(banners);
    const files = {
      filename: req.file.originalname,
      path: `/assets/categories/banners/${req.file.filename}`,
    };

    const { rows } = await pool.query(
      `INSERT INTO banners (name, banner_url, sub_category_id) VALUES ($1, $2, $3) returning *`,
      [name, files.path, category_id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getBanners(req, res) {
  try {
    const { rows } = await pool.query(`
        SELECT b.id, b.name, b.banner_url, sc.name AS category_name, sc.id as category_id, sc.slug
        FROM banners AS b
        JOIN sub_categories AS sc ON b.sub_category_id = sc.id;
      `);
    res.json(rows);
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
    const filePath = path.join(
      __dirname,
      "../assets/categories/banners",
      fileName
    );

    await pool.query(`DELETE FROM banners WHERE id = $1 returning *`, [
      bannerId,
    ]);

    fs.unlinkSync(filePath);
    res.json({ message: "Banner deleted successfully." });
  } catch (error) {
    console.error(error);
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
    console.error(error);
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
