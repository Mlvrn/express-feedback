'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Feedbacks', [
      {
        feedbackText: 'Feature for customizing our characters',
        details:
          'So basically, can you please add a feature to customize our characters like gender, clothing, facial features, etc.',
        status: 'pending',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feedbackText: 'More gacha',
        details:
          'Pls create more gachas! I want to support your company. I will buy all of it',
        status: 'accepted',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        feedbackText: 'I hate your game',
        details:
          'As the title says, I hate it I hate it I hate it I hate it I hate it I hate it',
        status: 'rejected',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Feedbacks', null, {});
  },
};
