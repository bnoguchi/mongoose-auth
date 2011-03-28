var connect = require('connect')
  , connectAuth = require('connect-auth');

var Modules = {
    password: require('./lib/modules/password')
  , facebook: require('./lib/modules/facebook')
  , twitter: require('./lib/modules/twitter')
};

/**
 * Decorates the (User) Schema with the proper attributes.
 * @param {Schema} schema that gets decorated
 * @param {Object} options per module
 * @api public
 */
module.exports = function plugin (schema, opts) {
  var moduleName
    , decorate
    , moduleOpts;
  if (Object.keys(opts).length === 0)
    throw new Error('You must specify at least one module.');
  for (moduleName in opts) {
    try {
      decorate = Modules[moduleName].schema;
    } catch (e) {
      throw new Error("Missing module named " + moduleName);
    }
    moduleOpts = opts[moduleName];
    if (moduleOpts === true) {
      moduleOpts = {}
    }
    decorate(schema, {});
  }
};
