var Promise = require('everyauth').Promise
  , authenticate = require('./schema').authenticate
  , registerUser = require('./schema').registerUser;

// Defaults
module.exports = {
  authenticate: function (login, password) {
    var promise = new Promise();
    authenticate(login, password, function (err, didSucceed) {
      promise.fulfill(didSucceed);
    });
    return promise;
  },
  registerUser: function (login, password) {
    var promise = new Promise()
      , fields = {};
    fields[this.loginName()] = login;
    fields[this.passwordName()] = password;
    registerUser(fields, function (err, createdUser) {
      promise.fulfill(createdUser);
    });
    return promise;
  }
};
