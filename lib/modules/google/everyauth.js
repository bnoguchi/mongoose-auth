// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokExtra, googleUser) {
    var promise = this.Promise()
      , User = this.User()();
    // TODO Check user in session or request helper first
    //      e.g., req.user or sess.auth.userId
    User.findOne({'google.email': googleUser.id}, function (err, foundUser) {
      if (foundUser) {
        return promise.fulfill(foundUser);
      }
      console.log("CREATING");
      User.createWithGoogleOAuth(googleUser, accessTok, accessTokExtra, function (err, createdUser) {
        if (err) return promise.fail(err);
        return promise.fulfill(createdUser);
      });
    });
    return promise;
  }
};