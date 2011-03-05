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
  var moduleName
    , mod
    , moduleOpts;
  for (moduleName in opts) {
    try {
      mod = require('./modules/' + moduleName + '/schema');
    } catch (e) {
      throw new Error("Missing module named " + moduleName);
    }
    moduleOpts = opts[moduleName];
    if (moduleOpts === true) {
      moduleOpts = {}
    }
    mod(schema, {});
  }
};
