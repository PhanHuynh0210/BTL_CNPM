'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
      // For example: Device.belongsTo(models.Room, { foreignKey: 'room_id' });
    }
  }
  Device.init({
    device_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Active', 'Inactive', 'Maintenance'),
      defaultValue: 'Active'
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Rooms', // This should be the table name
        key: 'ID' // Reference to the ID column of Rooms table
      }
    }
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};
