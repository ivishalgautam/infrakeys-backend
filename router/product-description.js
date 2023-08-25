const router = require("express").Router();
const {
  createProductDescription,
  getProductDescriptions,
  getProductDescriptionById,
  deleteProductDescriptionById,
  updateProductDescriptionById,
} = require("../controller/product-despcription.controller");

// routes
router.post("/", createProductDescription);
router.put("/:productDescriptionId", updateProductDescriptionById);
router.delete("/:productDescriptionId", deleteProductDescriptionById);
router.get("/:productDescriptionId", getProductDescriptionById);
router.get("/products/:productId", getProductDescriptions);

module.exports = router;
