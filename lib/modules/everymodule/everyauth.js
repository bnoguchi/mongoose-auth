var Promise = require('everyauth').Promise;
var mongoose = require('mongoose');

// Defaults

module.exports = {
  findUserById: function (userId, fn) {
    mongoose.model('User').findById(userId, fn);
  }
};
