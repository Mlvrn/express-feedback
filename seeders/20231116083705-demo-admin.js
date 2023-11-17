'use strict';

const { hashPassword } = require('../utils/bcrypt');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = hashPassword('password');
    await queryInterface.bulkInsert('Admins', [
      {
        username: 'admin1',
        password: hashedPassword,
        email: 'admin1@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'admin2',
        password: hashedPassword,
        email: 'admin2@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  },
};
