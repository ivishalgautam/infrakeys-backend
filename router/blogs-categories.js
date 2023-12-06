const router = require("express").Router();
const controller = require("../controller/blog-category.controller");

router.post("/category", controller.create);
router.get("/category", controller.get);
router.delete("/category/:id", controller.deleteById);

module.exports = router;
