const express = require("express");
const { protect } = require("../authentication/userController");
const { deleteImageById } = require("./imageController");

const router = express();

router.delete("/delete-image-by-id/:imageId", protect, deleteImageById);

module.exports = router;
