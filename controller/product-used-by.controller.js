const { pool } = require("../config/db");
const path = require("path");
const fs = require("fs");

async function createProductUsedBy(req, res) {
  const { data, product_id } = req.body;
  try {
    let rows = [];
    for (const { title, image } of data) {
      const productUsedBy = await pool.query(
        `INSERT INTO product_used_by (title, image, product_id) VALUES ($1, $2, $3) returning *`,
        [title, image, product_id]
      );
      rows.push(productUsedBy.rows[0]);
    }

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductUsedBys(req, res) {
  const productId = parseInt(req.params.productId);
  try {
    const { rows } = await pool.query(
      `SELECT * FROM product_used_by WHERE product_id = $1`,
      [productId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getProductUsedById(req, res) {
  const productUsedById = parseInt(req.params.productUsedById);
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM product_used_by WHERE id = $1`,
      [productUsedById]
    );

    if (rowCount === 0)
      return res.status(404).json({ message: "Product used by not found!" });

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function deleteProductUsedById(req, res) {
  const productUsedById = parseInt(req.params.productUsedById);
  try {
    const productUsedByExist = await pool.query(
      `SELECT * FROM product_used_by WHERE id = $1`,
      [productUsedById]
    );

    if (productUsedByExist.rowCount === 0)
      return res.status(404).json({ message: "Product used by not found!" });

    // const fileName = path.basename(productUsedByExist.rows[0].icon);
    // const filePath = path.join(
    //   __dirname,
    //   "../assets/product-used-by",
    //   fileName
    // );

    await pool.query(`DELETE FROM product_used_by WHERE id = $1 returning *`, [
      productUsedById,
    ]);

    // fs.unlinkSync(filePath);
    res.json({ message: "Product used by deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateProductUsedById(req, res) {
  const productUsedById = parseInt(req.params.productUsedById);
  const { ...data } = req.body;
  const updateColumns = Object.keys(data)
    .map((column, key) => `${column} = $${key + 1}`)
    .join(", ");
  const updateValues = Object.values(data);
  try {
    const { rows, rowCount } = await pool.query(
      `UPDATE product_used_by SET ${updateColumns} WHERE id = ${
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
  createProductUsedBy,
  getProductUsedBys,
  getProductUsedById,
  deleteProductUsedById,
  updateProductUsedById,
};
