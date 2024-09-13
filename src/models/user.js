'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //User.belongsToMany(models.Role, { foreignKey: 'user_id', through: models.UserRole });
      User.hasMany(models.UserRole,{foreignKey: 'user_id'});
    }
  }
  User.init({
    user_id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_type_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    address: DataTypes.STRING,
    email_otp: DataTypes.STRING,
    phone_otp: DataTypes.STRING,
    forgot_password_token: DataTypes.STRING,
    is_active: {
      type: DataTypes.ENUM('y', 'n'),
      allowNull: false
    },
    is_ban: {
      type: DataTypes.ENUM('y', 'n'),
      allowNull: false
    },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    underscored: true,
  });
  return User;
};