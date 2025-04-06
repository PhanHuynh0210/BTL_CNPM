'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Support extends Model {
    static associate(models) {
      // Define the association between Support and Users
      Support.belongsTo(models.Users, {
        foreignKey: 'mssv',
        as: 'user', // Alias for the association
      });
    }
  }

  Support.init({
    support_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mssv: {
      type: DataTypes.STRING(20),
      allowNull: false,
      references: {
        model: 'Users', // This references the Users table
        key: 'mssv', // The mssv column in Users should match
      },
      onDelete: 'CASCADE', // If a user is deleted, the corresponding support will be deleted
      onUpdate: 'CASCADE',
    },
    support_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    contact_info: {
      type: DataTypes.STRING(255),
      allowNull: true,  // Optional field
    },
    time_sent: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,  // Default to the current timestamp
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
      defaultValue: 'Pending',  // Default status is 'Pending'
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Support',
    tableName: 'Supports', // Explicitly define the table name
    timestamps: false, // Disable auto generation of timestamps
  });

  return Support;
};
