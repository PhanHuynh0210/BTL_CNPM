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
    await queryInterface.bulkDelete('Support', null, {});
    await queryInterface.bulkInsert('Support', [
      {
        mssv: '22XXXXX',
        support_type: 'Thiết bị',
        title: 'Máy chiếu không hoạt động',
        description: 'Máy chiếu trong phòng 101 không lên hình. Tôi đã thử bật nhiều lần nhưng không có tín hiệu.',
        contact_info: 'student1@hcmut.edu.vn',
        time_sent: new Date(),
        status: 'Pending',  // Ensure it's one of 'Pending', 'In Progress', 'Resolved'
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: '23XXXXX',
        support_type: 'Phòng học',
        title: 'Phòng quá nóng',
        description: 'Phòng 102 không có quạt hoặc điều hòa, rất khó chịu khi học vào buổi chiều.',
        contact_info: '0356789123',
        time_sent: new Date(),
        status: 'Pending',  // Ensure it's one of 'Pending', 'In Progress', 'Resolved'
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: '22XXXXX',
        support_type: 'Hệ thống',
        title: 'Không đặt được phòng',
        description: 'Khi tôi chọn ngày và giờ để đặt phòng, hệ thống báo lỗi và không thể xác nhận.',
        contact_info: 'student1@hcmut.edu.vn',
        time_sent: new Date(),
        status: 'Pending',  // Ensure it's one of 'Pending', 'In Progress', 'Resolved'
        createdAt: new Date(),
        updatedAt: new Date()},
      {
        mssv: '23XXXXX',
        support_type: 'Khác',
        title: 'Cần tư vấn sử dụng hệ thống',
        description: 'Tôi là sinh viên mới và chưa biết cách sử dụng hệ thống đặt phòng, mong được hỗ trợ.',
        contact_info: 'student2@hcmut.edu.vn',
        time_sent: new Date(),
        status: 'Pending',  // Ensure it's one of 'Pending', 'In Progress', 'Resolved'
        createdAt: new Date(),
        updatedAt: new Date()
      },

    ]);
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
