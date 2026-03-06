'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
  }
  RefreshToken.init({
    refresh_tokens_id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    token_hash : DataTypes.TEXT,
    device_name : DataTypes.STRING,
    device_type : DataTypes.STRING,
    browser : DataTypes.STRING,
    ip_address : DataTypes.STRING,
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RefreshToken',
    tableName:  'refresh_tokens',
    underscored: true,
  });
  return RefreshToken;
};