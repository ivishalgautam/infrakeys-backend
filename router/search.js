const { search } = require("../controller/search.controller");

const router = require("express").Router();

router.get("/", search);

module.exports = router;
