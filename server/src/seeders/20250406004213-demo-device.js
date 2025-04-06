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
    await queryInterface.bulkInsert('Devices', [
      {
        device_name: 'Máy chiếu',
        status: 'Active',
        room_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        device_name: 'Điều hòa',
        status: 'Active',
        room_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        device_name: 'Máy tính',
        status: 'Maintenance',
        room_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        device_name: 'Quạt trần',
        status: 'Inactive',
        room_id: 4,
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
