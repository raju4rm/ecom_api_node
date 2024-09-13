'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      Example:
      await queryInterface.bulkInsert('user_type', [
        {
          type: 'Admin',
          created_by: 1,
          created_at: new Date(),
        },
        {
          type: 'Seller',
          created_by: 1,
          created_at: new Date(),
        },
        {
          type: 'Customer',
          created_by: 1,
          created_at: new Date(),
        },
      ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_type', null, {});
  }
};
