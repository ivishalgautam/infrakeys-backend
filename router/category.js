const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createCategory,
  updateCategoryById,
  deleteCategoryById,
  getCategoryById,
  getCategories,
} = require("../controller/category.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const folderPath = path.join(__dirname, "../assets/categories");
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
router.post(
  "/",
  verifyTokenAndAuthorization,
  uploads.single("file"),
  createCategory
);
router.put("/:categoryId", verifyTokenAndAuthorization, updateCategoryById);
router.delete("/:categoryId", verifyTokenAndAuthorization, deleteCategoryById);
router.get("/:categoryId", getCategoryById);
router.get("/", getCategories);

module.exports = router;
