'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('permission','link',{ 
      type: Sequelize.STRING 
    });
  },

  async removeColumn (queryInterface, Sequelize) {
    await queryInterface.removeColumn('permission','link');
  }
};
