const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createProduct(req, res) {
  console.log(req.files);
  const { title, about, sub_category_id } = req.body;
  try {
    const images_urls = req.files.map((file) => `/${file.filename}`);
    console.log(images_urls);

    const { rows } = await pool.query(
      `INSERT INTO products (title, about, images, sub_category_id) VALUES ($1, $2, $3, $4) returning *`,
      [title, about, images_urls, sub_category_id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProducts(req, res) {
  try {
    const { rows } = await pool.query(`SELECT * FROM products`);
    res.json(rows);
  } catch (error) {
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
    res.status(500).json({ message: error.message });
  }
}

async function deleteProductById(req, res) {
  const productId = parseInt(req.params.productId);
  try {
    const productExist = await pool.query(
      `SELECT * FROM products WHERE id = $1`,
      [productId]
    );

    if (productExist.rowCount === 0)
      return res.status(404).json({ message: "Product not found!" });

    console.log(productExist);

    productExist.images.forEach((imagePath) => {
      const fileName = path.basename(imagePath);
      const filePath = path.join(__dirname, "../assets/products", fileName);
      fs.unlinkSync(filePath);
    });

    // const fileName = path.basename(productExist.rows[0].images);
    // const filePath = path.join(__dirname, "../assets/products", fileName);

    await pool.query(`DELETE FROM products WHERE id = $1 returning *`, [
      bannerId,
    ]);

    fs.unlinkSync(filePath);

    res.json({ message: "product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProductById(req, res) {
  const productId = parseInt(req.params.productId);
  const { ...productData } = req.body;
  const updateColumns = Object.keys(productData)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(productData);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE products SET ${updateColumns} WHERE id = ${
        updateValues.length + 1
      } returning *`,
      [...updateValues, productId]
    );
    if (rowCount === 0) {
      return res.status(404).json({ message: "Product not found!" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  deleteProductById,
  updateProductById,
};
