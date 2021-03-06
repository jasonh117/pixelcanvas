const Sequelize = require('sequelize');
const nconf = require('nconf');

const postgresConfig = nconf.get('postgres');

const sequelize = new Sequelize(
  postgresConfig.database,
  postgresConfig.username,
  postgresConfig.password,
  postgresConfig.options
);

const db = {
  sequelize,
  Sequelize,
  Pixels: sequelize.import('./pixels'),
  Users: sequelize.import('./user'),
};

module.exports = db;
