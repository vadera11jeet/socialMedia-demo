const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../utils/dbUtils");

const comments = sequelize.define("Comments", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  commentText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },    
});

module.exports = comments;
