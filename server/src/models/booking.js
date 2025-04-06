'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Một booking thuộc về một phòng
      Booking.belongsTo(models.Room, {
        foreignKey: 'room_id',
        as: 'room'
      });

      // Một booking thuộc về một user
      Booking.belongsTo(models.Users, {
        foreignKey: 'mssv',
        targetKey: 'mssv',
        as: 'user'
      });
    }
  }

  Booking.init({
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mssv: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    Day: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('Confirmed', 'Pending', 'Cancelled'),
      defaultValue: 'Pending'
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });

  return Booking;
};
