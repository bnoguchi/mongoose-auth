var schema = exports.schema = require('./schema');
exports.plugin = require('./plugin');
exports.everyauth = require('./everyauth');
var everyauth = require('everyauth');
//exports.router = require('./connect').router;

Object.defineProperty(exports, 'specialOptHandlers', {
    value: {
      loginWith: function (value) {
        if (value) {
          delete schema.login;
          schema[value] = { type: String, unique: true };
          everyauth.password.loginWith(value);
        }
      }
    }
  , enumerable: false
});
