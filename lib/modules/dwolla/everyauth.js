// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokExtra, dUser) {
    var promise = this.Promise()
      , User = this.User()();
    // TODO Check user in session or request helper first
    //      e.g., req.user or sess.auth.userId
    User.findOne({'dwolla.id': dUser.Id}, function (err, foundUser) {
      if (foundUser) {
        foundUser.updateDwollaData(dUser, accessTok, function (err, foundUser){
          if (err) return promise.fail(err);
          return promise.fulfill(foundUser);
        });
      } else {
        User.createWithDwolla(dUser, accessTok, function (err, createdUser) {
          if (err) return promise.fail(err);
          return promise.fulfill(createdUser);
        });
      }
    });
    return promise;
  }
};
