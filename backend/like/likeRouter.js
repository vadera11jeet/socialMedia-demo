const express = require("express");
const { protect } = require("../authentication/userController");
const {
  toggleLike,
  feedIsLikedByUser,
  getLikedUserList,
} = require("./likeController");

const router = express.Router();

router.patch("/toggle-like/:feedId", protect, toggleLike);
router.get("/total-user-like-list", protect, feedIsLikedByUser);
router.get("/liked-user-list/:feedId", protect, getLikedUserList);

module.exports = router;
