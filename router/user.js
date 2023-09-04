const router = require("express").Router();
const {
  getUsers,
  updateUserById,
  deleteUserById,
  getUserById,
} = require("../controller/user.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

// routes
router.get("/", verifyTokenAndAuthorization, getUsers);
router.put("/:userId", verifyTokenAndAuthorization, updateUserById);
router.delete("/:userId", verifyTokenAndAuthorization, deleteUserById);
router.get("/:userId", getUserById);
// router.get("/", getProducts);

module.exports = router;
