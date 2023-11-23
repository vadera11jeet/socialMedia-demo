const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/dbUtils");

const like = sequelize.define("Like", {
  id: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
});

module.exports = like;
