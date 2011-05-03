// Defaults
module.exports = {
  authenticate: function (login, password, req, res) {
    var promise = this.Promise();
    this.User()().authenticate(login, password, function (err, user) {
      if (err) {
        return promise.fulfill(null, [err.message || err]);
      }
//      if (err) return promise.fail(err);
      promise.fulfill(user, []);
    });
    return promise;
  },

  registerUser: function (login, password) {
    var promise = this.Promise()
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
