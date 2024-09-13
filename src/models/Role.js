'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Role.belongsToMany(models.User, { foreignKey: 'role_id', through: models.UserRole });
      Role.hasMany(models.UserRole,{foreignKey: 'role_id'});
      Role.hasMany(models.RolePermission,{foreignKey: 'role_id'});
    }
  }
  Role.init({
    role_id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    slug: DataTypes.STRING(100),
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    is_active: {
      type: DataTypes.ENUM('y', 'n'),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Role',
    tableName:  'role',
    underscored: true,
  });
  return Role;
};