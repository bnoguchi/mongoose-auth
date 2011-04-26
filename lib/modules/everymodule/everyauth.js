var Promise = require('everyauth').Promise;

// Defaults

module.exports = {
  findUserById: function (userId, fn) {
    this.User()().findById(userId, fn);
  }
};
