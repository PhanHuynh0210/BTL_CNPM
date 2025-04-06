'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Feedbacks', {
      feedback_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mssv: {
        type: Sequelize.STRING(20),
        allowNull: false,
        references: {
          model: 'Users',  // Assuming there's a Users table with a mssv field
          key: 'mssv'
        },
        onDelete: 'CASCADE',  // If the user is deleted, their feedback will be deleted
        onUpdate: 'CASCADE'   // If the mssv is updated, update accordingly
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      Time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW  // Defaults to current timestamp
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Automatically set the creation time
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') // Automatically set the update time
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Feedbacks');
  }
};