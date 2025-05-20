
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
   async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bids', {
      bid_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      auction_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Auctions',
          key: 'auction_id',
        },
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
          model: 'Users',
          key: 'user_id',
        },
        allowNull: false,
      },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      bidTime: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down (queryInterface, Sequelize)  {
    await queryInterface.dropTable('Bids');
  }
};
