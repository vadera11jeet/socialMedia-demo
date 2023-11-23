"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Images.belongsTo(models.Feed, { foreignKey: "feedId" });
    }
  }
  Images.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      image: { type: DataTypes.STRING, allowNull: false },
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
      hooks: {
        beforeDestroy: (image, option) => {
          console.log("in before delete hook");
          console.log(image);
          console.log(option);
        },
        afterDestroy: (image, option) => {
          console.log("in after delete hook");
          console.log(image);
          console.log(option);
        },
      },

      sequelize,
      modelName: "Images",
    }
  );

  // Images.afterDestroy(function (img, options) {
  //   console.log("in after delete function");
  //   console.log(img);
  //   console.log(options);
  // });
  return Images;
};
