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

describe('User', function () {
  it('should generate a salt and set a hash when password is set', function () {
    var user = new User();
    should.strictEqual(undefined, user.salt);
    should.strictEqual(undefined, user.hash);
    user.password = 'hello';
    user.password.should.equal('hello');
    user.salt.should.not.be.undefined;
    user.hash.should.not.be.undefined;
  });
  it('should authenticate with a correct password', function (done) {
    var user = new User();
    user.password = 'hello';
    user.authenticate('hello', function (err, matched) {
      matched.should.be.true;
      done();
    });
  });
  it('should fail authentication with an incorrect password', function (done) {
    var user = new User();
    user.password = 'correct';
    user.authenticate('incorrect', function (err, matched) {
      matched.should.be.false;
      done();
    });
  });
});
