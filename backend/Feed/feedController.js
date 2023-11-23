const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const catchAsync = require("../utils/catchAsync");
const { Feed: FeedModel } = require("../models");
const { users: UserModel } = require("../models");
const { Images: ImageModel } = require("../models");
const { Tag: TagModel } = require("../models");
const { Comments: CommentModel } = require("../models");
const { Like: LikeModel } = require("../models");
const socket = require("../socketServer");

// const Images = ImageModel.findAll({
//   where: {
//     feedId: {
//       [Op.eq]: "f612297c-0529-4099-a646-52873905299f",
//     },
//   },
// }).then((row) => {
//   const img = row.map((r) => {
//     console.log(r.image);
//     return r;
//   });
// });

exports.createFeed = catchAsync(async (req, res, async) => {
  try {
    let { description, taggedUserList } = req.body;
    const newFeed = await FeedModel.create({
      description,
      userId: req.user.id,
    });

    const images = req.files.map((image) => ({
      image: image.filename,
      feedId: newFeed.id,
    }));

    if (images.length) {
      await ImageModel.bulkCreate(images);
    }

    if (taggedUserList) {
      if (taggedUserList instanceof Array) {
        taggedUserList = [...taggedUserList];
        const taggedUsers = taggedUserList.map((user) => ({
          userId: user,
          feedId: newFeed.id,
        }));
        await TagModel.bulkCreate(taggedUsers);
      } else {
        await TagModel.create({
          userId: taggedUserList,
          feedId: newFeed.id,
        });
      }
    }

    const createdFeed = await FeedModel.findByPk(newFeed.id, {
      include: [
        {
          model: UserModel,
          required: true,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: ImageModel,
          require: true,
          attributes: ["image", "id"],
        },
        {
          model: TagModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "taggedUserId",
          },
        },
        {
          model: CommentModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "commentedUserId",
          },
        },
        {
          model: LikeModel,
          require: true,
        },
      ],
    });

    const createdSocket = socket.getSocket();
    createdSocket.emit("createdFeed", createdFeed);

    return res.status(201).json({
      status: "success",
      data: createdFeed,
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
});

exports.getAllFeed = catchAsync(async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = 4;
    const offset = (page - 1) * limit;

    const { count, rows: feedList } = await FeedModel.findAndCountAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: UserModel,
          required: true,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: ImageModel,
          require: true,
          attributes: ["image", "id"],
        },
        {
          model: TagModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "taggedUserId",
          },
        },
        {
          model: CommentModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "commentedUserId",
          },
        },
        {
          model: LikeModel,
          require: true,
        },
      ],
      offset,
      limit,
    });

    let hasMore = false;
    if (offset + limit < count) hasMore = true;

    res.status(200).json({
      status: "success",
      totalCount: feedList.length,
      data: feedList,
      hasMore,
    });
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});

exports.getFeedsByUser = catchAsync(async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const limit = 4;
    const offset = (page - 1) * limit;
    const userId = req.params.userId ?? req.user.id;
    const { count, rows: feedList } = await FeedModel.findAndCountAll({
      order: [["createdAt", "DESC"]],
      where: {
        UserId: userId,
      },

      include: [
        {
          model: UserModel,
          required: true,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: ImageModel,
          require: true,
          attributes: ["image", "id"],
        },
        {
          model: TagModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "taggedUserId",
          },
        },
        {
          model: CommentModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "commentedUserId",
          },
        },
        {
          model: LikeModel,
          require: true,
        },
      ],
      offset,
      limit,
    });

    let hasMore = false;
    if (offset + limit < count) hasMore = true;

    res.status(200).json({
      status: "success",
      totalCount: count,
      data: feedList,
      hasMore,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.updateFeed = catchAsync(async (req, res, next) => {
  if (!req.params.feedId) {
    return res.status(400).json({
      status: "failed",
      message: "provide feed id which you want to edit",
    });
  }

  if (!req.body.description) {
    return res.status(400).json({
      status: "failed",
      message: "provide description for feed",
    });
  }

  try {
    const feed = await FeedModel.findByPk(req.params.feedId);

    if (!feed) {
      return res.status(404).json({
        status: "failed",
        message: "can't find feed with this id",
      });
    }

    if (feed.userId !== req.user.id) {
      return res.status(400).json({
        status: "failed",
        message: "this posts not belows to you",
      });
    }

    let { taggedUserList, isTaggedListRemoved, isImagesRemoved } = req.body;

    let files = req.files;
    files = [...files];

    if (isTaggedListRemoved) {
      await TagModel.destroy({
        where: {
          feedId: {
            [Op.eq]: req.params.feedId,
          },
        },
      });
    }

    if (isImagesRemoved) {
      await ImageModel.destroy({
        where: {
          feedId: {
            [Op.eq]: req.params.feedId,
          },
        },
      });
    }

    if (files.length && !isImagesRemoved) {
      const images = req.files.map((image) => {
        return {
          image: image.filename,
          feedId: req.params.feedId,
        };
      });

      if (images.length) {
        await ImageModel.bulkCreate(images);
      }
    }

    if (taggedUserList && !isTaggedListRemoved) {
      await TagModel.destroy({
        where: {
          feedId: {
            [Op.eq]: req.params.feedId,
          },
        },
      });

      if (taggedUserList instanceof Array) {
        taggedUserList = [...taggedUserList];
        const taggedUsers = taggedUserList.map((user) => ({
          userId: user,
          feedId: req.params.feedId,
        }));
        await TagModel.bulkCreate(taggedUsers);
      } else {
        await TagModel.create({
          userId: taggedUserList,
          feedId: req.params.feedId,
        });
      }
    }

    await FeedModel.update(
      {
        description: req.body.description,
      },
      {
        where: {
          id: {
            [Op.eq]: req.params.feedId,
          },
        },
      }
    );

    const updatedFeedValue = await FeedModel.findByPk(req.params.feedId, {
      include: [
        {
          model: UserModel,
          required: true,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: ImageModel,
          require: true,
          attributes: ["image", "id"],
        },
        {
          model: TagModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "taggedUserId",
          },
        },
        {
          model: CommentModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "commentedUserId",
          },
        },
        {
          model: LikeModel,
          require: true,
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      data: updatedFeedValue,
    });
  } catch (e) {
    return res.status(500).json({
      status: "failed",
      message: e.message,
    });
  }
});

exports.deleteFeed = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return res.status(401).json({
      status: "failed",
      message: "provide valid feed id",
    });
  }

  try {
    const allImages = await ImageModel.findAll({
      where: {
        feedId: {
          [Op.eq]: req.params.id,
        },
      },
    });

    const imageDir = path.join(__dirname, "../uploads");
    const imageFileList = allImages.map((img) => {
      return path.join(imageDir, img.image);
    });

    imageFileList.forEach(imgPath => {
      fs.unlink(imgPath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
        } else {
          console.log(`File ${imgPath} has been deleted successfully.`);
        }
      });
    })



    await FeedModel.destroy({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.eq]: req.params.id,
            },
          },
          {
            UserId: {
              [Op.eq]: req.user.id,
            },
          },
        ],
      },
    });

    return res.status(204).json({
      status: "success",
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.getFeedById = catchAsync(async (req, res, next) => {
  if (!req.params.feedId) {
    return res.status(401).json({
      status: "failed",
      message: "provide valid feed id",
    });
  }

  try {
    const feed = await FeedModel.findOne({
      where: {
        id: { [Op.eq]: req.params.feedId },
      },
      include: [
        {
          model: UserModel,
          required: true,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: ImageModel,
          require: true,
          attributes: ["image", "id"],
        },
        {
          model: TagModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "taggedUserId",
          },
        },
        {
          model: CommentModel,
          require: true,
          include: {
            model: UserModel,
            require: true,
            attributes: ["firstName", "lastName"],
            as: "commentedUserId",
          },
        },
        {
          model: LikeModel,
          require: true,
        },
      ],
    });
    if (!feed) {
      return res.status(404).json({
        status: "failed",
        message: "can't find feed with given Id",
      });
    }

    return res.status(200).json({
      status: "success",
      data: feed,
    });
  } catch (err) {
    return res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
});
