require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { pool } = require("./config/db");
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "*", // Allow requests from any origin
  methods: "GET,PUT,POST,DELETE",
  credentials: true, // Enable credentials (e.g., cookies) for cross-origin requests
  optionsSuccessStatus: 204, // Respond with a 204 status code for preflight requests
};
app.use(cors(corsOptions));

app.use(morgan("tiny"));
app.use("/api/auth", require("./router/auth"));
app.use("/api/users", require("./router/user"));
app.use("/api/products", require("./router/product"));
app.use("/api/dashboard", require("./router/dashboard"));
app.use("/api/product-applications", require("./router/product-application"));
app.use("/api/product-descriptions", require("./router/product-description"));
app.use("/api/product-features", require("./router/product-feature"));
app.use("/api/product-used-by", require("./router/product-used-by"));
app.use("/api/product-queries", require("./router/product-queries"));
app.use("/api/banners", require("./router/banner"));
app.use("/api/categories", require("./router/category"));
app.use("/api/sub-categories", require("./router/sub-category"));
app.use("/api/industries", require("./router/industries"));
app.use("/api", require("./router/recently-view"));
app.use("/api/search", require("./router/search"));
app.use("/api/blogs", require("./router/blogs"));
app.use("/api/blogs-categories", require("./router/blogs-categories"));
app.use("/api", require("./router/otp"));

app.use("/api/update-slug", async (req, res) => {
  try {
    const { rows: subCats } = await pool.query(`SELECT * FROM sub_categories;`);
    const { rows: products } = await pool.query(`SELECT * FROM products;`);
    const { rows: blogs } = await pool.query(`SELECT * FROM blogs;`);
    console.log({ subCats, products, blogs });

    for (const subCat of subCats) {
      const slug = subCat.name.trim().toLowerCase().split(" ").join("-");
      // console.log({ catSlug: slug });
      await new Promise((resolve) => {
        pool.query(
          `UPDATE sub_categories SET slug = $1 WHERE id = $2 returning *;`,
          [slug, slug.id],
          (err, result) => {
            if (!err) {
              console.log("sub_categories slug updated");
              console.log(result);
            }
            resolve();
          }
        );
      });
    }

    for (const product of products) {
      const slug = product.title.trim().toLowerCase().split(" ").join("-");
      // console.log({ productSlug: slug });
      await new Promise((resolve) => {
        pool.query(
          `UPDATE products SET slug = $1 WHERE id = $2 returning *;`,
          [slug, slug.id],
          (err, result) => {
            if (!err) {
              console.log("products slug updated");
              console.log(result.rows);
            }
            resolve();
          }
        );
      });
    }

    for (const blog of blogs) {
      const slug = blog.title.trim().toLowerCase().split(" ").join("-");
      // console.log({ blogSlug: slug });
      await new Promise((resolve) => {
        pool.query(
          `UPDATE blogs SET slug = $1 WHERE id = $2 returning *;`,
          [slug, slug.id],
          (err, result) => {
            if (!err) {
              console.log("blogs slug updated");
              console.log({ result });
            }
            resolve();
          }
        );
      });
    }

    res.json({ message: "slugs updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.use("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server up and running on localhost:${PORT}`);
});
