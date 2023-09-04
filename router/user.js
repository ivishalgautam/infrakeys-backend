const router = require("express").Router();
const {
  getUsers,
  updateUserById,
  deleteUserById,
  getUserById,
} = require("../controller/user.controller");
const {
  verifyTokenAndAuthorization,
  verifyToken,
} = require("../middleware/verifyToken");

// routes
router.get("/", verifyTokenAndAuthorization, getUsers);
router.put("/:userId", verifyToken, updateUserById);
router.delete("/:userId", verifyTokenAndAuthorization, deleteUserById);
router.get("/:userId", verifyToken, getUserById);
// router.get("/", getProducts);

module.exports = router;
