'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.hasMany(models.RolePermission,{foreignKey: 'permission_id'});

    }
  }
  Permission.init({
    permission_id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    permission: DataTypes.STRING,
    slug: DataTypes.STRING(100),
    module: DataTypes.STRING,
    method: DataTypes.STRING,          
    link: DataTypes.STRING,          
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Permission',
    tableName:'permission',
    underscored: true
  });
  return Permission;
};