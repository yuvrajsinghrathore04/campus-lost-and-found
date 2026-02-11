const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createItem,
  getAllItems,
  getItemById,
  getUserItems,
  updateItem,
  deleteItem,
  getAdminAllItems,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

router.get("/", getAllItems);
router.get("/my-items", protect, getUserItems);
router.get("/admin/all", protect, adminOnly, getAdminAllItems);
router.get("/:id", getItemById);
router.post("/", protect, upload.single("image"), createItem);
router.put("/:id", protect, upload.single("image"), updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;