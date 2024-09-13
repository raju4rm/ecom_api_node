'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('user_role', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'fk_userrole_role_id',
      references: {
        table: 'role',
        field: 'role_id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('user_role', 'fk_userrole_role_id');

  }
};
