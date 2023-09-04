const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createIndustry,
  updateIndustryById,
  deleteIndustryById,
  getIndustryById,
  getIndustries,
} = require("../controller/industries.controller");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const folderPath = path.join(__dirname, "../assets/industries");
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
  createIndustry
);
router.put("/:industryId", verifyTokenAndAuthorization, updateIndustryById);
router.delete("/:industryId", verifyTokenAndAuthorization, deleteIndustryById);
router.get("/:industryId", getIndustryById);
router.get("/", getIndustries);

module.exports = router;
