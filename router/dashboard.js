const { getDashboardDetails } = require("../controller/dashboard.controller");

const router = require("express").Router();

router.get("/details", getDashboardDetails);

module.exports = router;
