'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Support', {
      support_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      mssv: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      support_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      contact_info: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      time_sent: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('Pending', 'In Progress', 'Resolved'),
        defaultValue: 'Pending',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add foreign key constraint
    await queryInterface.addConstraint('Support', {
      fields: ['mssv'],
      type: 'foreign key',
      name: 'fk_support_mssv', // Optional name for the constraint
      references: {
        table: 'Users',
        field: 'mssv',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Support');
  }
};
