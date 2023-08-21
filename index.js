require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use(express.static("assets/*"));

app.use("/api/auth", require("./router/auth"));
app.use("/api/products", require("./router/product"));
app.use("/api/banners", require("./router/banner"));
app.use("/api/categories", require("./router/category"));
app.use("/api/sub-categories", require("./router/sub-category"));

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(PORT, () => {
  console.log(`Server up and running on localhost:${PORT}`);
});
