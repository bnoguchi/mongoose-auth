var Promise = require('everyauth').Promise;

// Defaults

module.exports = {
  findOrCreateUser: function (sess, accessTok, fbUser) {
    var promise = new Promise()
      , self = this;
    this.User()().findOne({'fb.id': fbUser.id}, function (err, foundUser) {
      if (foundUser)
        return promise.fulfill(foundUser);
      self.User()().createWithFB(fbUser, accessTok, function (err, createdUser) {
        return promise.fulfill(createdUser);
      });
    });
  }
};
