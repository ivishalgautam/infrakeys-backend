const router = require("express").Router();
const {
  createProductDescription,
  getProductDescriptions,
  getProductDescriptionById,
  deleteProductDescriptionById,
  updateProductDescriptionById,
} = require("../controller/product-description.controller");

// routes
router.post("/", createProductDescription);
router.put("/:productDescriptionId", updateProductDescriptionById);
router.delete("/:productDescriptionId", deleteProductDescriptionById);
router.get("/:productDescriptionId", getProductDescriptionById);
router.get("/:productId", getProductDescriptions);

module.exports = router;
