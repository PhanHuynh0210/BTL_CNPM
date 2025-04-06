'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      mssv: {
        type: Sequelize.STRING(20),
        primaryKey: true,  // Set mssv as the primary key
        allowNull: false,
        unique: true  // Ensure mssv is unique
      },
      FullName: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true  // Make Email unique
      },
      Pass: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      Phone: {
        type: Sequelize.STRING(20),
        unique: true,  // Make Phone unique
        allowNull: true  // Phone is optional
      },
      Sex: {
        type: Sequelize.ENUM('M', 'F', 'Other'),  // Enum for Sex
        allowNull: true  // Sex is optional
      },
      Role: {
        type: Sequelize.ENUM('Admin_IT', 'Student', 'School', 'Admin_IOT'),  // Enum for Role
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')  // Default value is the current timestamp
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')  // Default value is the current timestamp
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
