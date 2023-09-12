const {
  createQuery,
  deleteQueryByUserId,
  getAllQueries,
  getUserQueries,
} = require("../controller/product-query.controller");
const {
  isLoggedIn,
  verifyTokenAndAuthorization,
} = require("../middleware/verifyToken");

const router = require("express").Router();

// routes
router.post("/", isLoggedIn, createQuery);
// router.delete("/:userId", deleteQueryByUserId);
router.get("/", getAllQueries);
router.get("/:userId", isLoggedIn, getUserQueries);
router.get("/admin/:userId", verifyTokenAndAuthorization, getUserQueries);

module.exports = router;
