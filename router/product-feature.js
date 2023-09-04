const router = require("express").Router();
const {
  createProductFeature,
  getProductFeatures,
  getProductFeatureById,
  deleteProductFeatureById,
  updateProductFeatureById,
} = require("../controller/product-feature.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

// routes
router.post("/", verifyTokenAndAuthorization, createProductFeature);
router.put(
  "/:productFeatureId",
  verifyTokenAndAuthorization,
  updateProductFeatureById
);
router.delete(
  "/:productFeatureId",
  verifyTokenAndAuthorization,
  deleteProductFeatureById
);
router.get("/:productFeatureId", getProductFeatureById);
router.get("/products/:productId", getProductFeatures);

module.exports = router;
