'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CheckInOut extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      CheckInOut.belongsTo(models.Users, {
        foreignKey: 'mssv',
        targetKey: 'mssv',
        as: 'user', // Alias for the association
      });
      CheckInOut.belongsTo(models.Booking, {
        foreignKey: 'book_id',
        targetKey: 'ID', // Target key in Bookings model
        as: 'booking', // Alias for the association
      });
    }
  }

  CheckInOut.init({
    check_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mssv: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time_in: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    time_out: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status_check: {
      type: DataTypes.ENUM('Not-checked-in', 'Checked-in'),
      defaultValue: 'Not-checked-in',
    },
  }, {
    sequelize,
    modelName: 'CheckInOut',
  });

  return CheckInOut;
};
