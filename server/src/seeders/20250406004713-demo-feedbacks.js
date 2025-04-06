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
    await queryInterface.bulkInsert('Feedbacks', [
      {
        mssv: '22XXXXX',
        rating: 5,
        comment: 'Phòng học rộng rãi, thoáng mát.',
        Time: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        mssv: '23XXXXX',
        rating: 4,
        comment: 'Thiết bị hoạt động tốt nhưng cần bảo trì thêm.',
        Time: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        mssv: '22XXXXX',
        rating: 3,
        comment: 'Phòng hơi chật khi học nhóm.',
        Time: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        mssv: '23XXXXX',
        rating: 2,
        comment: 'Thiếu điều hòa, hơi nóng.',
        Time: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
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
