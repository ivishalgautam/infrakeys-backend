const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createProductUsedBy,
  getProductUsedBys,
  getProductUsedById,
  deleteProductUsedById,
  updateProductUsedById,
} = require("../controller/product-used-by.controller");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const folderPath = path.join(__dirname, "../assets/product-used-by");
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
router.post("/", uploads.single("file"), createProductUsedBy);
router.put("/:productApplicationId", updateProductUsedById);
router.delete("/:productApplicationId", deleteProductUsedById);
router.get("/:productApplicationId", getProductUsedById);
router.get("/:productId", getProductUsedBys);

module.exports = router;
