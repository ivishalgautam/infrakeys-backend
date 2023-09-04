const router = require("express").Router();
const {
  createProductApplication,
  getProductApplications,
  getProductApplicationById,
  deleteProductApplicationById,
  updateProductApplicationById,
} = require("../controller/product-application.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

// routes
// k
router.post("/", verifyTokenAndAuthorization, createProductApplication);
router.put(
  "/:productApplicationId",
  verifyTokenAndAuthorization,
  updateProductApplicationById
);
router.delete(
  "/:productApplicationId",
  verifyTokenAndAuthorization,
  deleteProductApplicationById
);
router.get("/:productApplicationId", getProductApplicationById);
router.get("/products/:productId", getProductApplications);

module.exports = router;
