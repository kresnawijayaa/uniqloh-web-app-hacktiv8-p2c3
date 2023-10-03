"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = require("../data/users.json").map((user) => {
      const { hashPassword } = require("../helpers/hash");
      const newPassword = hashPassword(user.password);
      user.password = newPassword;
      user.createdAt = user.updatedAt = new Date();
      return user;
    });
    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
