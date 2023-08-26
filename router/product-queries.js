const {
  createQuery,
  deleteQueryByUserId,
  getAllQueries,
  getUserQueries,
} = require("../controller/product-query.controller");

const router = require("express").Router();

// routes
router.post("/", createQuery);
// router.delete("/:userId", deleteQueryByUserId);
router.get("/", getAllQueries);
router.get("/:userId", getUserQueries);

module.exports = router;
