const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createProduct(req, res) {
  // console.log(req.files);
  const { title, about, sub_category_id, keywords } = req.body;
  const slug = title.trim().toLowerCase().split(" ").join("-");

  try {
    const images_urls = req.files.map(
      (file) => `/assets/categories/products/${file.filename}`
    );
    // console.log(images_urls);

    const { rows } = await pool.query(
      `INSERT INTO products (title, about, images, sub_category_id, keywords, slug) VALUES ($1, $2, $3, $4, $5, $6) returning *`,
      [title, about, images_urls, sub_category_id, keywords, slug]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, sc.name as sub_category_name FROM products p JOIN sub_categories sc ON p.sub_category_id = sc.id;`
      // `SELECT * FROM products;`
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getProductById(req, res) {
  const productId = parseInt(req.params.productId);
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [productId]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Product not found!" });

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getProductBySlug(req, res) {
  const slug = req.params.slug;
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM products WHERE slug = $1`,
      [slug]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Product not found!" });

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function deleteProductById(req, res) {
  // console.log(__dirname);
  const productId = parseInt(req.params.productId);
  try {
    const productExist = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [productId]
    );

    if (productExist.rowCount === 0)
      return res.status(404).json({ message: "Product not found!" });

    productExist.rows[0].images.forEach((imagePath) => {
      const fileName = path.basename(imagePath);
      const filePath = path.join(
        __dirname,
        "../assets/categories/products",
        fileName
      );
      fs.unlinkSync(filePath);
    });

    await pool.query(`DELETE FROM products WHERE id = $1;`, [productId]);

    res.json({ message: "product deleted successfully." });
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateProductById(req, res) {
  const productId = parseInt(req.params.productId);
  const { title, about, images, sub_category_id } = req.body;

  const images_urls = req.files.map(
    (file) => `/assets/categories/products/${file.filename}`
  );
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE products SET title = $1, about = $2, images = $3, sub_category_id = $4 WHERE id = $5 returning *`,
      [title, about, [...JSON.parse(images_urls)], sub_category_id, productId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Product not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function getRelatedProducts(req, res) {
  const subCategoryId = parseInt(req.params.subCategoryId);
  try {
    const { rows } = await pool.query(
      `SELECT * FROM products WHERE sub_category_id = $1;`,
      [subCategoryId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProductById,
  updateProductById,
  getRelatedProducts,
  getProductBySlug,
};
