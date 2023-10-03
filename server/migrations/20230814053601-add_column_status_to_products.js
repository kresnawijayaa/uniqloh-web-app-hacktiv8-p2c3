"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "Active",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Products", "status");
  },
};
