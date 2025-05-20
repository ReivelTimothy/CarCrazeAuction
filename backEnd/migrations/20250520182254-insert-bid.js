
'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
   async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bids', {
      bid_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      auctionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Auctions',
          key: 'auction_id',
        },
        allowNull: false,
      },
      userId: {
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
    await queryInterface.dropTable('Admins');
  }
};
