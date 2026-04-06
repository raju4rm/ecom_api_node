'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('master_category', {
      master_category_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      parent_id: {
        type: Sequelize.INTEGER
      },
      level: {
        type: Sequelize.INTEGER
      },
      sort_order: {
        type: Sequelize.INTEGER
      },
      icon: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.ENUM('y', 'n'),
        allowNull: false,
        defaultValue: 'y',
      },
      created_by: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_by: {
        type: Sequelize.INTEGER
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('master_category');
  }
};
