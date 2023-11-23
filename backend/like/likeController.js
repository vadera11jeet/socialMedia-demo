const { Like: LikeModel } = require("../models");
const { users: UserModel } = require("../models");
const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const socket  = require("../socketServer");

exports.toggleLike = catchAsync(async (req, res, next) => {
  if (!req.params.feedId) {
    return res.status(400).json({
      status: "failed",
      message: "provide feed id for like/unlike",
    });
  }

  try {
    const [_, created] = await LikeModel.findOrCreate({
      where: {
        feedId: {
          [Op.eq]: req.params.feedId,
        },
        userId: {
          [Op.eq]: req.user.id,
        },
      },
      defaults: {
        feedId: req.params.feedId,
        userId: req.user.id,
      },
    });

    if (!created) {
      const _ = await LikeModel.destroy({
        where: {
          feedId: {
            [Op.eq]: req.params.feedId,
          },
          userId: {
            [Op.eq]: req.user.id,
          },
        },
      });
    }
    const totalLikeCount = await LikeModel.count({
      where: {
        feedId: {
          [Op.eq]: req.params.feedId,
        },
      },
    });


    const userLikeList = await LikeModel.findAll({
      where: {
        feedId: {
          [Op.eq]: req.params.feedId,
        },
      },
      include: {
        model: UserModel,
        require: true,
        attributes: {
          exclude: ["password"],
        },
      },
    });


    return res.status(200).json({
      status: "success",
      isLiked: created,
      likeCount: totalLikeCount,
      userLikeList,
    });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
});

exports.feedIsLikedByUser = catchAsync(async (req, res, next) => {
  try {
    const userLikedList = await LikeModel.findAll({
      attributes: ["feedId"],
      where: {
        userId: {
          [Op.eq]: req.user.id,
        },
      },
    });

    res.status(200).json({
      status: "success",
      userLikedList,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

exports.getLikedUserList = catchAsync(async (req, res, next) => {
  if (!req.params.feedId) {
    return res.status(400).json({
      status: "failed",
      message: "provide feed id for like/unlike",
    });
  }

  try {
    const userLikeList = await LikeModel.findAll({
      where: {
        feedId: {
          [Op.eq]: req.params.feedId,
        },
      },
      include: {
        model: UserModel,
        require: true,
        attributes: {
          exclude: ["password"],
        },
      },
    });

    res.status(200).json({
      status: "success",
      data: userLikeList,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});
