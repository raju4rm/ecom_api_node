'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('permission','module',{ 
      type: Sequelize.STRING 
    });
  },

  async removeColumn (queryInterface, Sequelize) {
    await queryInterface.removeColumn('permission','module');
  }
};
