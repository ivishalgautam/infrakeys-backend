const router = require("express").Router();
const controller = require("../controller/blog-category.controller");

router.post("/", controller.create);
router.get("/", controller.get);
router.delete("/:id", controller.deleteById);

module.exports = router;
