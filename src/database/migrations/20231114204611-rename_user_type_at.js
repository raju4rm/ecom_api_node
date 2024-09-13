'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('user_type', 'createdAt', 'created_at');
    await queryInterface.renameColumn('user_type', 'updatedAt', 'updated_at');

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('user_type', 'createdAt', 'created_at');
    await queryInterface.renameColumn('user_type', 'updatedAt', 'updated_at');

  }
};
