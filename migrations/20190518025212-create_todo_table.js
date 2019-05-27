'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("todos", {
      id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
      },
      content: {
          type: Sequelize.STRING(250),
          allowNull: false
      },
      is_done: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
      },
      user_id: Sequelize.INTEGER(11),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("todos");
  }
};
