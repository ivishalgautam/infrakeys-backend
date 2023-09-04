const {
  getDashboardDetails,
  getUserDetails,
} = require("../controller/dashboard.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/details", verifyTokenAndAuthorization, getDashboardDetails);
router.get(
  "/user-details/:userId",
  verifyTokenAndAuthorization,
  getUserDetails
);

module.exports = router;
