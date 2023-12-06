const router = require("express").Router();
const controller = require("../controller/blogs.controller");
const CategoryController = require("../controller/blog-category.controller");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const folderPath = path.join(__dirname, "../assets/categories/products");
    // console.log(folderPath);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    callback(null, folderPath);
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname.split(" ").join("-")}`);
  },
});
const uploads = multer({ storage });

router.post("/", uploads.single("file"), controller.create);
router.get("/", controller.get);
router.get("/:blogId", controller.getById);
router.put("/:blogId", controller.update);
router.put("/update-image/:blogId", controller.updateBlogImage);
router.delete("/delete-image/:blogId", controller.deleteBlogImage);

// blog categories
router.post("/category", CategoryController.create);
router.get("/category", CategoryController.get);
router.delete("/category/:id", CategoryController.deleteById);

module.exports = router;