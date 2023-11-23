"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feed extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Feed.belongsTo(models.users, { foreignKey: "userId" });
      Feed.hasMany(models.Comments, {
        onDelete: "cascade",
      });
      Feed.hasMany(models.Images, {
        onDelete: "cascade",
      });
      Feed.hasMany(models.Like, {
        onDelete: "cascade",
      });
      Feed.hasMany(models.Tag, {
        onDelete: "cascade",
      });
    }
  }
  Feed.init(
    {
      id:{
        type:DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue:DataTypes.UUIDV4,
      },
      description: { type: DataTypes.TEXT('long')	, allowNull: false },

      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Feed",
    }
  );
  return Feed;
};
