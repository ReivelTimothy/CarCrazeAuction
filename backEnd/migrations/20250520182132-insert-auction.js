'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Auctions', {
      auction_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      startingPrice: { type: Sequelize.INTEGER, allowNull: false },
      currentPrice: { type: Sequelize.INTEGER, allowNull: false },
      startDate: { type: Sequelize.DATE, allowNull: false },
      endDate: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.ENUM('OPEN', 'CLOSED'), allowNull: false },
      category: { type: Sequelize.ENUM('CAR', 'MOTORCYCLE'), allowNull: false },
      image: { type: Sequelize.STRING },
      vehicleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Vehicles',
          key: 'vehicle_id',
        },
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Auctions');
  }
};
