require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
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
app.use("/api/blog-categories", require("./router/blogs-categories"));
app.use("/api", require("./router/otp"));

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`Server up and running on localhost:${PORT}`);
});
