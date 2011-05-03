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
      , extraParams: function (value) {
          if (value && value.constructor == Object) {
            for (var k in value) {
              schema[k] = value[k];
            }
            everyauth.password.extractExtraRegistrationParams( function (req) {
              function recurse (obj, ret, prefix) {
                ret || (ret = {});
                prefix || (prefix = []);
                return Object.keys(obj).reduce( function (ret, k) {
                  prefix.push(k);
                  if (obj[k].constructor == Object && !obj[k].type) {
                    ret[k] = recurse(obj[k], {}, prefix);
                  } else {
                    ret[k] = req.body[prefix.join('.')];
                  }
                  prefix.pop(k);
                  return ret;
                }, ret);
              }
              var params = recurse(value);
              return params;
            });
          }
        }
    }
  , enumerable: false
});
