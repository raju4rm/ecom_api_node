'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('refresh_tokens', {
      refresh_tokens_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      token_hash : {
        allowNull: false,
        type: Sequelize.TEXT
      },
      device_name : {
        type: Sequelize.STRING
      },
      device_type : {
        type: Sequelize.STRING
      },
      browser : {
        type: Sequelize.STRING
      },
      ip_address : {
        type: Sequelize.STRING
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      revoked_at: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('refresh_tokens');
  }
};
