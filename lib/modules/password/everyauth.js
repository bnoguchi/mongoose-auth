var Promise = require('everyauth').Promise;

// Defaults
module.exports = {
  authenticate: function (login, password) {
    var promise = new Promise();
    this.User()().authenticate(login, password, function (err, user) {
      if (err) return promise.fail(err);
      promise.fulfill(user);
    });
    return promise;
  },

  registerUser: function (login, password) {
    var promise = new Promise()
      , fields = {};
    fields[this.loginName()] = login;
    fields[this.passwordName()] = password;
    this.User()().create(fields, function (err, createdUser) {
      if (err) return promise.fail(err);
      promise.fulfill(createdUser);
    });
    return promise;
  }
};
