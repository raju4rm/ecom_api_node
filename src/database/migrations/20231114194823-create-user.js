'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING
      },
      email_otp: {
        type: Sequelize.STRING
      },
      phone_otp: {
        type: Sequelize.STRING
      },
      forgot_password_token: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.ENUM('y', 'n'),
        allowNull: false,
        defaultValue: 'y',
      },
      is_ban: {
        type: Sequelize.ENUM('y', 'n'),
        allowNull: false,
        defaultValue: 'n',
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      updated_by: {
        type: Sequelize.INTEGER
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};