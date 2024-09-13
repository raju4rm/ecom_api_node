'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserRole.belongsTo(models.User,{foreignKey: 'user_id'});
      UserRole.belongsTo(models.Role,{foreignKey: 'role_id'});
    }
  }
  UserRole.init({
    user_role_id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'user_role',
    timestamps: false,    // Disable createdAt & updatedAt
    /* define: {
      noPrimaryKey: true,
    }, */
  });
  //UserRole.removeAttribute('id'); // remove primary key
  return UserRole;
};