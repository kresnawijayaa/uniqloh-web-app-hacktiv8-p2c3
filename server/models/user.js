"use strict";
const { Model } = require("sequelize");

const { hashPassword } = require("../helpers/hash");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Product, { foreignKey: "authorId" });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            args: true,
            msg: `Email required.`,
          },
          notNull: {
            args: true,
            msg: `Email required.`,
          },
          isEmail: {
            args: true,
            msg: `Email format incorrect`,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: `Password required.`,
          },
          notNull: {
            args: true,
            msg: `Password required.`,
          },
          len: {
            args: [5],
            msg: `Password length is at least 5 characters`,
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: DataTypes.STRING,
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(user) {
          const newPassword = hashPassword(user.password);
          user.password = newPassword;
        },
      },
    }
  );
  return User;
};
