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
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

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
router.post(
  "/",
  verifyTokenAndAuthorization,
  uploads.single("file"),
  createBanner
);
router.put("/:bannerId", verifyTokenAndAuthorization, updateBannerById);
router.delete("/:bannerId", verifyTokenAndAuthorization, deleteBannerById);
router.get("/:bannerId", getBannerById);
router.get("/", getBanners);

module.exports = router;
