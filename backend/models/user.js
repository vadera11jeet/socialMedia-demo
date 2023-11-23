"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Feed);
      User.hasMany(models.Comments);
      User.hasMany(models.Like);
      User.hasMany(models.Tag);
    }
  }
  User.init(
    {
      id:{
        type:DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue:DataTypes.UUIDV4,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isPasswordValid(value) {
            const passwordRegex =
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(value)) {
              throw new Error(
                "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character."
              );
            }
          },
        },
      },
      resetToken:{
        type:DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: "users",
    }
  );

  User.prototype.validatePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  User.beforeCreate(async (user) => {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
  });


  return User;
};
