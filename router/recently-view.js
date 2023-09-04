const {
  viewProduct,
  recentlyViewed,
} = require("../controller/recently-view.controller");
const { isLoggedIn } = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/view-product", isLoggedIn, viewProduct);
router.get("/recently-viewed/:userId", isLoggedIn, recentlyViewed);

module.exports = router;
