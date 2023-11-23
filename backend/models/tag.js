"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsTo(models.users, { foreignKey: "userId", as: "taggedUserId" });
      Tag.belongsTo(models.Feed, { foreignKey: "feedId" });
    }
  }
  Tag.init(
    {
      id:{
        type:DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue:DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
        as:"taggedUserId"
      },
      feedId: {
        type: DataTypes.UUID,
        references: {
          model: "Feeds",
          key: "id",
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );
  return Tag;
};
