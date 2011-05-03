// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokExtra, fbUser) {
    var promise = this.Promise()
      , self = this;
    // TODO Check user in session or request helper first
    //      e.g., req.user or sess.auth.userId
    this.User()().findOne({'fb.id': fbUser.id}, function (err, foundUser) {
      if (foundUser)
        return promise.fulfill(foundUser);
      self.User()().createWithFB(fbUser, accessTok, accessTokExtra.expires, function (err, createdUser) {
        return promise.fulfill(createdUser);
      });
    });
    return promise;
  }
};
