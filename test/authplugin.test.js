var should = require('should')
  , mongoose = require('mongoose')
  , UserSchema = new mongoose.Schema()
  , authPlugin = require('../index')
  , User;

UserSchema.plugin(authPlugin, {
  password: true
});

mongoose.model('User', UserSchema);
User = mongoose.model('User');

module.exports = {
  "setting a user's password should generate a salt and set a hash": function () {
    var user = new User();
    should.strictEqual(undefined, user.salt);
    should.strictEqual(undefined, user.hash);
    user.password = 'hello';
    user.password.should.equal('hello');
    user.salt.should.not.be.undefined;
    user.hash.should.not.be.undefined;
  },

  'a user should authenticate with a correct password': function () {
    var user = new User();
    user.password = 'hello';
    user.authenticate('hello').should.be.true;
  },

  'a user should fail authentication with an incorrect password': function () {
    var user = new User();
    user.password = 'correct';
    user.authenticate('incorrect').should.be.false;
  }
};
