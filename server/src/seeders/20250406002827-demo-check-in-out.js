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
    await queryInterface.bulkInsert('CheckInOuts', [
      {
        mssv: '22XXXXX',
        book_id: 1,
        time_in: '2025-04-05 08:05:00',
        time_out: null,
        status_check: 'Checked-in',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: '23XXXXX',
        book_id: 2,
        time_in: null,
        time_out: null,
        status_check: 'Not-checked-in',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: '22XXXXX',
        book_id: 3,
        time_in: '2025-04-07 13:10:00',
        time_out: '2025-04-07 15:00:00',
        status_check: 'Checked-in',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: '23XXXXX',
        book_id: 4,
        time_in: '2025-04-08 14:05:00',
        time_out: '2025-04-08 16:00:00',
        status_check: 'Checked-in',
        createdAt: new Date(),
        updatedAt: new Date()
      }
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
