var everyauth = require('everyauth');

everyauth.everymodule.configurable({
  'User': 'A function that returns the mongoose User model (not Schema).'
});

var Modules = {
    everymodule: require('./lib/modules/everymodule')
  , password: require('./lib/modules/password')
  , facebook: require('./lib/modules/facebook')
  , twitter: require('./lib/modules/twitter')
  , github: require('./lib/modules/github')
  , instagram: require('./lib/modules/instagram')
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
    , _module
    , everyauthConfig
    , everyauthDefaults;
  if (Object.keys(opts).length === 0)
    throw new Error('You must specify at least one module.');

  // Make sure to flag everymodule, so that we
  // run the everyauth defaults for everymodule later
  opts.everymodule || (opts.everymodule = true);

  for (moduleName in opts) {
    _module = Modules[moduleName];
    if (!_module)
      throw new Error("Missing module named " + moduleName);

    decorateSchema = _module.schema;

    moduleOpts = opts[moduleName];
    if (moduleOpts === true) {
      moduleOpts = {};
    }

    everyauthConfig = moduleOpts.everyauth || {};

    // Module specific defaults for everyauth
    everyauthDefaults = _module.everyauth;
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
