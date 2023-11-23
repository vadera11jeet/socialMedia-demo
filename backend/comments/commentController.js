const { Op } = require("sequelize");
const { Comments: CommentModel } = require("../models");
const { users: UserModel } = require("../models");
const { Feed: FeedModel } = require("../models");
const catchAsync = require("../utils/catchAsync");

exports.createComment = catchAsync(async (req, res, next) => {
  try {
    if (!req.params.feedId) {
      return res.status(400).json({
        status: "failed",
        message: "provide feed id",
      });
    }

    const isFeedExists = await FeedModel.findByPk(req.params.feedId);

    if (!isFeedExists) {
      return res.status(404).json({
        status: "failed",
        message: "can't find feed with give id",
      });
    }

    if (!req.body.commentText) {
      return res.status(400).json({
        status: "failed",
        message: "provide text for comment",
      });
    }

    const createdComment = await CommentModel.create({
      commentText: req.body.commentText,
      userId: req.user.id,
      feedId: req.params.feedId,
    });

    const { count, rows: commentList } = await CommentModel.findAndCountAll({
      where: {
        FeedId: req.params.feedId,
      },
      include: {
        model: UserModel,
        required: true,
        attributes: ["firstName", "lastName"],
        as:"commentedUserId"
      },
    });

    return res.status(201).json({
      status: "success",
      data: createdComment,
      commentList,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.getCommentByFeed = catchAsync(async (req, res, next) => {
  try {
    const { count, rows: commentList } = await CommentModel.findAndCountAll({
      where: {
        FeedId: req.params.feedId,
      },
      include: {
        model: UserModel,
        required: true,
        attributes: ["firstName", "lastName"],
        as:"commentedUserId"
      },
    });

    return res.status(200).json({
      status: "success",
      data: commentList,
      totalCount: count,
    });
  } catch (err) {
    return res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  try {
    const deletedComment = await CommentModel.destroy({
      where: {
        [Op.and]: [
          {
            id: req.params.id,
          },
          {
            UserId: req.user.id,
          },
        ],
      },
    });

    if (!deletedComment) {
      return res.status(404).json({
        status: "failed",
        message: "can't find comment with given id",
      });
    }

    const { count, rows: commentList } = await CommentModel.findAndCountAll({
      where: {
        FeedId: req.params.feedId,
      },
      include: {
        model: UserModel,
        required: true,
        attributes: ["firstName", "lastName"],
        as:'commentedUserId'
      },
    });

    return res.status(200).json({
      status: "success",
      commentList,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
});

// exports.updateComment = catchAsync(async (req, res, next) => {
//   if (!req.body.commentText || !req.params.id) {
//     return res.status(400).json({
//       status: "failed",
//       message: "provide comment text and params id",
//     });
//   }

//   const updatedComment = await CommentModel.update(req.body, {
//     where: {
//       [Op.and]: [
//         {
//           id: req.params.id,
//         },
//         {
//           UserId: req.user.id,
//         },
//       ],
//     },
//   });

//   return res.status(204).json({
//     status: "success",
//     data: updatedComment,
//   });
// });
