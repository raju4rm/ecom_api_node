'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MasterCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  }
  MasterCategory.init({
    master_category_id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    is_active: {
      type: DataTypes.ENUM('y', 'n'),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'MasterCategory',
    tableName:  'master_category',
    underscored: true,
  });
  return MasterCategory;
};