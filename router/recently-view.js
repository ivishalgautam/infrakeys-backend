const {
  viewProduct,
  recentlyViewed,
} = require("../controller/recently-view.controller");
const {
  isLoggedIn,
  verifyTokenAndAuthorization,
} = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/view-product", isLoggedIn, viewProduct);
router.get("/recently-viewed/:userId", isLoggedIn, recentlyViewed);
router.get(
  "/admin/recently-viewed/:userId",
  verifyTokenAndAuthorization,
  recentlyViewed
);

module.exports = router;
