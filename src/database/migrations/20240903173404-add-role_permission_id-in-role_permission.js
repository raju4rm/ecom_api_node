'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('role_permission', 'role_permission_id', {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('role_permission', 'role_permission_id');

  }
};
