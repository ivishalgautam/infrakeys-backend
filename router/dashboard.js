const { getDashboardDetails } = require("../controller/dashboard.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

const router = require("express").Router();

router.get("/details", verifyTokenAndAuthorization, getDashboardDetails);

module.exports = router;
