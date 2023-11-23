const fs = require("fs");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const { Images: ImageModel } = require("../models");

exports.deleteImageById = catchAsync(async (req, res, next) => {
  try {

    const image = await ImageModel.findByPk(req.params.imageId)
    await ImageModel.destroy({
      where: {
        id: req.params.imageId,
      },
    });

    const imageDir = path.join(__dirname, "../uploads");
    const imageFilePath = path.join(imageDir, image.image)
    

    fs.unlink(imageFilePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      } else {
        console.log(`File ${imageFilePath} has been deleted successfully.`);
      }
    });

    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});
