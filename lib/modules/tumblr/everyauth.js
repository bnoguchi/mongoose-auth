// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokSecret, tumblrUser) {
    var promise = this.Promise()
      , self = this;
    this.User()().findOne({'tumblr.name': tumblrUser.name}, function (err, foundUser) {
      if (err) return promise.fail(err);
      if (foundUser) {
        return promise.fulfill(foundUser);
      }
      self.User()().createWithTumblr(tumblrUser, accessTok, accessTokSecret, function (err, createdUser) {
        if (err) return promise.fail(err);
        return promise.fulfill(createdUser);
      });
    });
    return promise;
  }
};
