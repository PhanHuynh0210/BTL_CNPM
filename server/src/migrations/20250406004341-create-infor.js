'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.createTable('Infors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contact_info: {
        type: Sequelize.TEXT,
        allowNull: false  // Assuming contact info should not be null
      },
      Time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW  // Automatically set current timestamp if not provided
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')  // Automatically set creation time
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')  // Automatically set update time
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Infors');
  }
};