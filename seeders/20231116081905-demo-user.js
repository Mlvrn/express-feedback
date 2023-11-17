'use strict';

/** @type {import('sequelize-cli').Migration} */

const { hashPassword } = require('../utils/bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = hashPassword('password');
    await queryInterface.bulkInsert('Users', [
      {
        username: 'user1',
        password: hashedPassword,
        email: 'user1@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user2',
        password: hashedPassword,
        email: 'user2@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
