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
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkInsert('Users', [
      {
        mssv: 'IT001',
        FullName: 'Nguyễn Văn A',
        Email: 'admin_it@hcmut.edu.vn',
        Pass: 'admin123',
        Phone: '0123456789',
        Sex: 'M',
        Role: 'Admin_IT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: 'IOT001',
        FullName: 'Trần Thị B',
        Email: 'admin_iot@hcmut.edu.vn',
        Pass: 'iotadmin123',
        Phone: '0987654321',
        Sex: 'F',
        Role: 'Admin_IOT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: '22XXXXX',
        FullName: 'Lê Văn C',
        Email: 'student1@hcmut.edu.vn',
        Pass: 'student123',
        Phone: '0345678912',
        Sex: 'M',
        Role: 'Student',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: '23XXXXX',
        FullName: 'Phạm Thị D',
        Email: 'student2@hcmut.edu.vn',
        Pass: 'student456',
        Phone: '0356789123',
        Sex: 'F',
        Role: 'Student',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        mssv: '24XXXXX',
        FullName: 'Đỗ Văn E',
        Email: 'school@hcmut.edu.vn',
        Pass: 'school123',
        Phone: '0367891234',
        Sex: 'M',
        Role: 'School',
        createdAt: new Date(),
        updatedAt: new Date()
      }
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
