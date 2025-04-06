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
    await queryInterface.bulkDelete('Rooms', null, {});
    await queryInterface.sequelize.query('ALTER TABLE Rooms AUTO_INCREMENT = 1');
    await queryInterface.bulkInsert('Rooms', [
      {
        capacity: 10,
        location: 'Tòa nhà A1 - Phòng 101',
        status: 'Available',
        qr_code: 'QR101',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        capacity: 20,
        location: 'Tòa nhà A1 - Phòng 102',
        status: 'Occupied',
        qr_code: 'QR102',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        capacity: 15,
        location: 'Tòa nhà A2 - Phòng 201',
        status: 'Maintenance',
        qr_code: 'QR201',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        capacity: 25,
        location: 'Tòa nhà A2 - Phòng 202',
        status: 'Available',
        qr_code: 'QR202',
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
