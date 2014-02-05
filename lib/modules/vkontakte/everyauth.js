// Defaults
module.exports = {
  findOrCreateUser: function (sess, accessTok, accessTokExtra, vkUser) {
      var promise = this.Promise()
      , User = this.User()();
    // TODO Check user in session or request helper first
    //      e.g., req.user or sess.auth.userId
    User.findOne({'vk.id': vkUser.uid}, function (err, foundUser) {
      if (foundUser) {
        return promise.fulfill(foundUser);
      }
      User.createWithVK(vkUser, accessTok, accessTokExtra.expires_in, function (err, createdUser) {
        if (err) return promise.fail(err);
        return promise.fulfill(createdUser);
      });
    });
    return promise;
  }
};
