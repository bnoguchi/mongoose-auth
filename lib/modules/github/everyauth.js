// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokExtra, ghUser) {
    var promise = this.Promise()
      , self = this;
    // TODO Check user in session or request helper first
    //      e.g., req.user or sess.auth.userId
    this.User()().findOne({'github.id': ghUser.id}, function (err, foundUser) {
      if (foundUser)
        return promise.fulfill(foundUser);
      self.User()().createWithGithub(ghUser, accessTok, function (err, createdUser) {
        return promise.fulfill(createdUser);
      });
    });
    return promise;
  }
};
