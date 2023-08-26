const router = require("express").Router();
const {
  getUsers,
  updateUserById,
  deleteUserById,
  getUserById,
} = require("../controller/user.controller");

// routes
router.get("/", getUsers);
router.put("/:userId", updateUserById);
router.delete("/:userId", deleteUserById);
router.get("/:userId", getUserById);
// router.get("/", getProducts);

module.exports = router;
