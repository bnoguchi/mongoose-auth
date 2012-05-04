// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokExtra, fbUser) {
    var promise = this.Promise()
      , User = this.User()();
    // TODO Check user in session or request helper first
    //      e.g., req.user or sess.auth.userId
    User.findOne({'fb.id': fbUser.id}, function (err, foundUser) {
      if (err) return promise.fail(err);
      if (foundUser) {
        foundUser.updateFBData(fbUser, accessTok, accessTokExtra.expires, function (err, foundUser){
          if (err) return promise.fail(err);
          return promise.fulfill(foundUser);
        });
      } else {
        User.createWithFB(fbUser, accessTok, accessTokExtra.expires, function (err, createdUser) {
          if (err) return promise.fail(err);
          return promise.fulfill(createdUser);
        });
      }
    });
    return promise;
  }
};
