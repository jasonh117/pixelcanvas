const tableName = 'pixels';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(tableName,
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        x: {
          type: Sequelize.INTEGER,
        },
        y: {
          type: Sequelize.INTEGER,
        },
        color: {
          type: Sequelize.STRING,
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        updatedAt: {
          type: Sequelize.DATE,
        },
      },
    ),
      // .then(() => queryInterface.addIndex(tableName, ['x', 'y'], { indexName: 'pixels_xy', indicesType: 'UNIQUE' })),
  down: queryInterface =>
    queryInterface.dropTable(tableName, { cascade: true, truncate: true })
};
