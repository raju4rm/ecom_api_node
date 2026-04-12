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
      MasterCategory.belongsTo(models.MasterCategory, {
        as: 'parent',
        foreignKey: 'parent_id',
        targetKey: 'master_category_id'
      });
    }
  }
  MasterCategory.init({
    master_category_id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    slug: DataTypes.STRING,
    parent_id: DataTypes.INTEGER,
    level: DataTypes.INTEGER,
    sort_order: DataTypes.INTEGER,
    icon: DataTypes.STRING,
    image: DataTypes.STRING,
    is_active: {
      type: DataTypes.ENUM('y', 'n'),
      allowNull: false
    },
    created_by: DataTypes.INTEGER,
    updated_by: DataTypes.INTEGER,
    
  }, {
    sequelize,
    modelName: 'MasterCategory',
    tableName:  'master_category',
    underscored: true,
    timestamps: true

  });
  return MasterCategory;
};