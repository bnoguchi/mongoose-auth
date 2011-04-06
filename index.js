var everyauth = require('everyauth');

var Modules = {
    password: require('./lib/modules/password')
  , facebook: require('./lib/modules/facebook')
};

/**
 * Decorates the (User) Schema with the proper attributes.
 * @param {Schema} schema that gets decorated
 * @param {Object} options per module
 * @api public
 */
exports = module.exports = function plugin (schema, opts) {
  var moduleName
    , decorateSchema
    , moduleOpts
    , module
    , everyauthConfig
    , everyauthDefaults;
  if (Object.keys(opts).length === 0)
    throw new Error('You must specify at least one module.');
  for (moduleName in opts) {
    module = Modules[moduleName];
    if (!module)
      throw new Error("Missing module named " + moduleName);

    decorateSchema = Modules[moduleName].schema;

    moduleOpts = opts[moduleName];
    if (moduleOpts === true) {
      moduleOpts = {};
    }

    everyauthConfig = moduleOpts.everyauth || {};
    // Module specific defaults for everyauth
    everyauthDefaults = module.everyauth;
    for (var k in everyauthDefaults) {
      if (!everyauthConfig[k])
        everyauthConfig[k] = everyauthDefaults[k];
    }
   
    // Configure everyauth for this module 
    for (var k in everyauthConfig) {
      everyauth[moduleName][k]( everyauthConfig[k] );
    }

    decorateSchema(schema, {});
  }

  // Delegate middleware method to
  // everyauth's middleware method
  exports.middleware = everyauth.middleware;

  // Delegate helpExpress method to everyauth.
  // Adds dynamic helpers such as loggedIn,
  // accessible from the views
  exports.helpExpress = everyauth.helpExpress;
};
