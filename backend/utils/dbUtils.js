const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
  }
);
const syncTable = async (model, options) => {
  await model.sync(options);
};

const associationOneToMany = (
  source,
  target,
  optionSource = {},
  optionDestination = {}
) => {
  source.hasMany(target, optionSource);
  target.belongsTo(source, optionDestination);
};

module.exports = { sequelize, syncTable, associationOneToMany };
