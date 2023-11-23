"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comments.belongsTo(models.users, {
        foreignKey: "userId",
        as: "commentedUserId",
      });
      Comments.belongsTo(models.Feed, { foreignKey: "feedId" });
    }
  }
  Comments.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      commentText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      feedId: {
        type: DataTypes.UUID,
        onDelete: "CASCADE",
        references: {
          model: "Feeds",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comments",
    }
  );
  return Comments;
};
