'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RolePermission.belongsTo(models.Role,{foreignKey: 'role_id'});
      RolePermission.belongsTo(models.Permission,{foreignKey: 'permission_id'});

    }
  }
  RolePermission.init({
    role_permission_id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role_id: DataTypes.INTEGER,
    permission_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RolePermission',
    tableName: 'role_permission',
    timestamps: false,    // Disable createdAt & updatedAt
    /* define: {
      noPrimaryKey: true,
    }, */ 
  });
  RolePermission.removeAttribute('id'); // remove primary key
  return RolePermission;
};
