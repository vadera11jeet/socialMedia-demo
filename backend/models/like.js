"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.Feed, { foreignKey: "feedId" });
      Like.belongsTo(models.users, { foreignKey: "userId" });
    }
  }
  Like.init(
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
      },
      feedId: {
        type: DataTypes.UUID,
        references: {
          model: "Feeds",
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
