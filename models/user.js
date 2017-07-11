const tableName = 'users';
const passwordUtils = require('../lib/password');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(tableName, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING(72),
      set(val) {
        this.setDataValue('password', passwordUtils.hashPassword(val));
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  });

  User.prototype.comparePassword = function(password) {
    const that = this;
    return passwordUtils.comparePassword(password.trim(), that.password);
  };

  User.prototype.toJSON = function() {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  };

  return User;
};
