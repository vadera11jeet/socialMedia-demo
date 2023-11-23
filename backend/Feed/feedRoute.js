const path = require("path");
const express = require("express");
const multer = require("multer");
const { protect } = require("../authentication/userController");
const {
  createFeed,
  getAllFeed,
  getFeedsByUser,
  updateFeed,
  deleteFeed,
  getFeedById,
} = require("./feedController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const router = express();

router.post("/create-feed", protect, upload.array("image"), createFeed);
router.get("/get-all-feed", protect, getAllFeed);
router.get("/get-user-feed/:userId", protect, getFeedsByUser);
router.delete("/delete-feed/:id", protect, deleteFeed);
router.get("/get-feed-by-id/:feedId", protect, getFeedById);
router.patch(
  "/update-feed/:feedId",
  protect,
  upload.array("image"),
  updateFeed
);

module.exports = router;
