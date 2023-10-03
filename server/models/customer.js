"use strict";
const { Model } = require("sequelize");
const { hashPassword } = require("../helpers/hash");
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Customer.hasMany(models.Favorite, { foreignKey: "CustomerId" });
    }
  }
  Customer.init(
    {
      username: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: `Email must be unique`,
        },
        validate: {
          notEmpty: {
            msg: `Email required.`,
          },
          notNull: {
            msg: `Email required.`,
          },
          isEmail: {
            msg: `Invalid email format`,
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: `Password required.`,
          },
          notNull: {
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
    },
    {
      sequelize,
      modelName: "Customer",
      hooks: {
        beforeCreate(customer) {
          const newPassword = hashPassword(customer.password);
          customer.password = newPassword;
        },
      },
    }
  );
  return Customer;
};
