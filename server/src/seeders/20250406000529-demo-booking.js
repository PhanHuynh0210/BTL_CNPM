'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.sequelize.query('ALTER TABLE Bookings AUTO_INCREMENT = 1');
    await queryInterface.bulkInsert('Bookings', [
      {
        room_id: 1,
        mssv: '22XXXXX',
        Day: '2025-04-05',
        start_time: '08:00:00',
        end_time: '10:00:00',
        status: 'Confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        room_id: 2,
        mssv: '23XXXXX',
        Day: '2025-04-06',
        start_time: '09:00:00',
        end_time: '11:00:00',
        status: 'Pending',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        room_id: 3,
        mssv: '22XXXXX',
        Day: '2025-04-07',
        start_time: '13:00:00',
        end_time: '15:00:00',
        status: 'Cancelled',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        room_id: 4,
        mssv: '23XXXXX',
        Day: '2025-04-08',
        start_time: '14:00:00',
        end_time: '16:00:00',
        status: 'Confirmed',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
