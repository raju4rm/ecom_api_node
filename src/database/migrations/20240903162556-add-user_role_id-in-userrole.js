'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user_role', 'user_role_id', {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('user_role', 'user_role_id');

  }
};
