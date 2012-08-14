var Promise = require('everyauth').Promise;
var mongoose = require('mongoose');

// Defaults

module.exports = {
  findUserById: function (userId, fn) {
    var UserModel = mongoose.model('User');
    UserModel.findById(userId, fn);
  }
};
