const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createSubCategory,
  deleteSubCategoryById,
  updateSubCategoryById,
  getSubCategories,
  getSubCategoryById,
  getSubCategorySlug,
} = require("../controller/sub-category.controller");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const folderPath = path.join(
      __dirname,
      "../assets/categories/sub-categories"
    );
    console.log(folderPath);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    callback(null, folderPath);
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploads = multer({ storage });

// routes
router.post("/", uploads.single("file"), createSubCategory);
router.put("/:subCategoryId", updateSubCategoryById);
router.delete("/:subCategoryId", deleteSubCategoryById);
router.get("/:subCategoryId", getSubCategoryById);
router.get("/slug/:slug", getSubCategorySlug);
router.get("/", getSubCategories);

module.exports = router;
