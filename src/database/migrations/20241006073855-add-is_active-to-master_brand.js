'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('master_brand','is_active',{ 
        type: Sequelize.ENUM('y', 'n'),
        allowNull: false,
        defaultValue: 'y',
       
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('master_brand','is_active');
  }
};
