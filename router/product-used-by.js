const router = require("express").Router();
const {
  createProductUsedBy,
  getProductUsedBys,
  getProductUsedById,
  deleteProductUsedById,
  updateProductUsedById,
} = require("../controller/product-used-by.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

// routes
router.post("/", verifyTokenAndAuthorization, createProductUsedBy);
router.put(
  "/:productUsedById",
  verifyTokenAndAuthorization,
  updateProductUsedById
);
router.delete(
  "/:productUsedById",
  verifyTokenAndAuthorization,
  deleteProductUsedById
);

router.get("/:productUsedById", getProductUsedById);
router.get("/products/:productId", getProductUsedBys);

module.exports = router;
