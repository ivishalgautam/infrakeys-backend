const router = require("express").Router();
const {
  createProductApplication,
  getProductApplications,
  getProductApplicationById,
  deleteProductApplicationById,
  updateProductApplicationById,
} = require("../controller/product-application.controller");

// routes
router.post("/", createProductApplication);
router.put("/:productApplicationId", updateProductApplicationById);
router.delete("/:productApplicationId", deleteProductApplicationById);
router.get("/:productApplicationId", getProductApplicationById);
router.get("/products/:productId", getProductApplications);

module.exports = router;
