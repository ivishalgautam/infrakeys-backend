const router = require("express").Router();
const {
  createProductFeature,
  getProductFeatures,
  getProductFeatureById,
  deleteProductFeatureById,
  updateProductFeatureById,
} = require("../controller/product-feature.controller");

// routes
router.post("/", createProductFeature);
router.put("/:productFeatureId", updateProductFeatureById);
router.delete("/:productFeatureId", deleteProductFeatureById);
router.get("/:productFeatureId", getProductFeatureById);
router.get("/:productId", getProductFeatures);

module.exports = router;
