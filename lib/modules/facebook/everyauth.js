// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokExtra, fbUser) {
    var promise = this.Promise()
      , User = this.User()();
    // TODO Check user in session or request helper first
    //      e.g., req.user or sess.auth.userId
    User.findOne({'fb.id': fbUser.id}, function (err, foundUser) {
      if (foundUser) {
        return promise.fulfill(foundUser);
      }
      console.log("CREATING");
      User.createWithFB(fbUser, accessTok, accessTokExtra.expires, function (err, createdUser) {
        console.log(err);
        console.log(createdUser);
        return promise.fulfill(createdUser);
      });
    });
    return promise;
  }
};
