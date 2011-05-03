// Defaults
module.exports = {
  authenticate: function (login, password) {
    var promise
      , errors = [];
    if (!login) errors.push('Missing login.');
    if (!password) errors.push('Missing password.');
    if (errors.length) return errors;

    promise = this.Promise();
    this.User()().authenticate(login, password, function (err, user) {
      if (err) {
        errors.push(err.message || err);
        return promise.fulfill(errors);
      }
      if (!user) {
        errors.push('Failed login.');
        return promise.fulfill(errors);
      }
      promise.fulfill(user);
    });
    return promise;
  },

  validateRegistration: function (newUserAttrs, errors) {
    var promise = this.Promise()
      , User = this.User()()
      , user = new User(newUserAttrs);
    user.validate( function (err) {
      if (err) {
        errors.push(err.message || err);
      }
      if (errors.length)
        return promise.fulfill(errors);
      promise.fulfill(null);
    });
    return promise;
  },

  registerUser: function (newUserAttrs) {
    var promise = this.Promise();
    this.User()().create(newUserAttrs, function (err, createdUser) {
      if (err) {
        console.log(err); // TODO Make depend on debug flag
        if (/duplicate key/.test(err)) {
          return promise.fulfill(['Someone already has claimed that login.']);
        }
        return promise.fail(err);
      }
      promise.fulfill(createdUser);
    });
    return promise;
  }
};
