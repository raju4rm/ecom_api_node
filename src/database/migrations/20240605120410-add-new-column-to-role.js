'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('role', 'is_active', {
      type: Sequelize.ENUM('y', 'n'),
      allowNull: false,
      defaultValue: 'y'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('role', 'is_active');
  }
};
