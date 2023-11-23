const { sequelize } = require("./utils/dbUtils");

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("database connection successfully");
  } catch (error) {
    console.log(error);
    console.log("unable to connect database");
  }
}

module.exports = connectToDatabase;
