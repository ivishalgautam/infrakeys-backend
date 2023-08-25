const {
  viewProduct,
  recentlyViewed,
} = require("../controller/recently-view.controller");

const router = require("express").Router();

router.post("/view-product", viewProduct);
router.get("/recently-viewed/:userId", recentlyViewed);

module.exports = router;
