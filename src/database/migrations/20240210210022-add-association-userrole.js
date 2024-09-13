'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('user_role', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userrole_user_id',
      references: {
        table: 'user',
        field: 'user_id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('user_role', 'fk_userrole_user_id');

  }
};
