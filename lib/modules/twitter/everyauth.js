// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokSecret, twitterUser) {
    var promise = this.Promise()
      , self = this;
    this.User()().findOne({'twit.id': twitterUser.id}, function (err, foundUser) {
      if (err) return promise.fail(err);
      if (foundUser) {
        return promise.fulfill(foundUser);
      }
      self.User()().createWithTwitter(twitterUser, accessTok, accessTokSecret, function (err, createdUser) {
        if (err) return promise.fail(err);
        return promise.fulfill(createdUser);
      });
    });
    return promise;
  }
};
