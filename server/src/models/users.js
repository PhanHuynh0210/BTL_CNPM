'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here, if any
    }
  }

  Users.init({
    mssv: {
      type: DataTypes.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    FullName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false
    },
    Pass: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Phone: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: true
    },
    Sex: {
      type: DataTypes.ENUM('M', 'F', 'Other'),
      allowNull: true
    },
    Role: {
      type: DataTypes.ENUM('Admin_IT', 'Student', 'School', 'Admin_IOT'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Users',
  });

  return Users;
};
