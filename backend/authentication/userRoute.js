const express = require("express");
const {
  signUp,
  getAllUsers,
  getUserById,
  login,
  protect,
  logout,
  forgotPassword,
  validateForgotPasswordToken,
  resetPassword,
  // deleteMe
} = require("./userController");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", protect, logout);
router.post("/forgot-password", forgotPassword);
// router.delete("/delete-me/", protect, deleteMe)
router.get("/get-all-user", protect, getAllUsers);
router.get("/user/:id", protect, getUserById);
router.get("/validate-link/:token", validateForgotPasswordToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
