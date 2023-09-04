const router = require("express").Router();
const {
  createProductDescription,
  getProductDescriptions,
  getProductDescriptionById,
  deleteProductDescriptionById,
  updateProductDescriptionById,
} = require("../controller/product-despcription.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

// routes
router.post("/", verifyTokenAndAuthorization, createProductDescription);
router.put(
  "/:productDescriptionId",
  verifyTokenAndAuthorization,
  updateProductDescriptionById
);
router.delete(
  "/:productDescriptionId",
  verifyTokenAndAuthorization,
  deleteProductDescriptionById
);
router.get("/:productDescriptionId", getProductDescriptionById);
router.get("/products/:productId", getProductDescriptions);

module.exports = router;
