'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // No associations needed for this model as per the schema
    }
  }

  Infor.init({
    contact_info: {
      type: DataTypes.TEXT,
      allowNull: false  // Ensure contact_info is required
    },
    Time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW  // Automatically set the current timestamp if not provided
    }
  }, {
    sequelize,
    modelName: 'Infor',
  });

  return Infor;
};
