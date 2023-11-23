const express = require("express");
const { protect } = require("../authentication/userController");
const {
  createComment,
  getCommentByFeed,
  deleteComment,
  updateComment,
} = require("./commentController");
  
const router = express.Router();

router.post("/create-comment/:feedId", protect, createComment);
router.get("/get-comment-by-feed/:feedId", protect, getCommentByFeed);
router.delete("/delete-comment/:id/:feedId", protect, deleteComment);
// router.patch("/update-comment/:id", protect, updateComment)

module.exports = router;
