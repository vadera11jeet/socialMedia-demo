const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbUtils");

const feed = sequelize.define(
  "Feed",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Feeds",
  }
);

module.exports = feed;
