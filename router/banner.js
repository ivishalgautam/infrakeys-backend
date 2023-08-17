const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getBanners,
  createBanner,
  deleteBannerById,
  getBannerById,
  updateBannerById,
} = require("../controller/banner.controller");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const folderPath = path.join(__dirname, "../assets/banners");
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
router.post("/", uploads.single("file"), createBanner);
router.put("/:bannerId", updateBannerById);
router.delete("/:bannerId", deleteBannerById);
router.get("/:bannerId", getBannerById);
router.get("/", getBanners);

module.exports = router;
