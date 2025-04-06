'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      // define association here (nếu sau này liên kết với Bookings, Devices, etc.)
    }
  }
  Room.init({
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Available', 'Occupied', 'Maintenance'),
      defaultValue: 'Available'
    },
    qr_code: {
      type: DataTypes.STRING(255),
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Room',
    tableName: 'Rooms', // khớp tên với bảng SQL gốc
    timestamps: true // để Sequelize tự thêm createdAt, updatedAt
  });
  return Room;
};
