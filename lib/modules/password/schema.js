//var crypto = require('crypto');
//
//var sha = function (num) {
//  function secureDigest (salt, digest, password, pepper) {
//    return crypto
//      .createHash('sha' + num) // or .createHmac('sha' + num, salt)
//      .update('--' + Array.prototype..join.call(arguments, '--') + '--')
//      .digest('hex');
//  }
//
//  return {
//    digest: function (password, stretches, salt, pepper) {
//      var digest = pepper;
//      while (stretches--) {
//        digest = secureDigest(salt, digest, password, pepper);
//      }
//      return digest;
//    }
//  };
//};
//
//var sha512 = sha(512);
//
//var sha1 = sha(1);

var bcrypt = require('bcrypt');

module.exports = function (schema, opts) {
  schema.add({
      login: { type: String, required: true }
  });

  schema.virtual('password').get( function () {
    return this._password;
  }).set( function (password) {
    this._password = password;
    var salt = this.salt = bcrypt.gen_salt(10);
    this.hash = bcrypt.hashpw(password, salt);
  });

  schema.method('authenticate', function (password) {
    return bcrypt.compare(password, this.hash);
  });

  schema.static('authenticate', function (login, password, callback) {
    this.findOne({login: login}, function (err, user) {
      callback(err, user);
    });
  });
};
