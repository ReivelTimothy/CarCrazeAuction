'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      vehicle_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      type: { type: Sequelize.STRING, allowNull: false },
      brand: { type: Sequelize.STRING, allowNull: false },
      model: { type: Sequelize.STRING, allowNull: false },
      year: { type: Sequelize.INTEGER, allowNull: false },
      color: { type: Sequelize.STRING, allowNull: false },
      mileage: { type: Sequelize.INTEGER, allowNull: false },
      transmissionType: { type: Sequelize.STRING, allowNull: false },
      fuelType: { type: Sequelize.STRING, allowNull: false },
      condition: { type: Sequelize.STRING, allowNull: false },
      documents: { type: Sequelize.TEXT, allowNull: false },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicles');
  }
};
