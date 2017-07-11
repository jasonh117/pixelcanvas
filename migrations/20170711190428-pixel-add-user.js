module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'pixels',
      'userid',
      {
        type: Sequelize.INTEGER,
      }
    )
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('pixels', 'userid');
  }
};