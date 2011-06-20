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

// Mostly, we need this because password needs to be loaded before everything else
// so that other modules can use everyauth.password.loginKey()
var moduleLoadOrder = ['everymodule', 'password', 'facebook', 'twitter', 'github', 'instagram'];

/**
 * Decorates the (User) Schema with the proper attributes.
 * @param {Schema} schema that gets decorated
 * @param {Object} options per module
 * @api public
 */
exports = module.exports = function plugin (schema, opts) {
  if (Object.keys(opts).length === 0)
    throw new Error('You must specify at least one module.');

  // Make sure to flag everymodule, so that we
  // run the everyauth defaults for everymodule later
  opts.everymodule || (opts.everymodule = true);

  moduleLoadOrder.filter( function (moduleName) {
    return moduleName in opts;
  }).forEach( function (moduleName) {
    var _module = Modules[moduleName];
    if (!_module)
      throw new Error("Missing module named " + moduleName);

    var decorateSchema = _module.plugin;

    var moduleOpts = opts[moduleName];
    if (moduleOpts === true) {
      moduleOpts = {};
    }

    var everyauthConfig = moduleOpts.everyauth || {};

    // Module specific defaults for everyauth
    var everyauthDefaults = _module.everyauth;
    for (var k in everyauthDefaults) {
      if (!everyauthConfig[k])
        everyauthConfig[k] = everyauthDefaults[k];
    }
   
    // Configure everyauth for this module 
    for (var k in everyauthConfig) {
      everyauth[moduleName][k]( everyauthConfig[k] );
    }

    // Parse special opts
    var val, handler;
    for (var opt in moduleOpts) {
      if (~['everyauth', 'everymodule'].indexOf(opt))
        continue;
      handler = _module.specialOptHandlers[opt];
      if (!handler) continue;
      val = moduleOpts[opt];
      handler(val);
    }

    decorateSchema(schema, {});
  });

  // Delegate middleware method to
  // everyauth's middleware method
  exports.middleware = everyauth.middleware.bind(everyauth);

  // Delegate helpExpress method to everyauth.
  // Adds dynamic helpers such as loggedIn,
  // accessible from the views
  exports.helpExpress = everyauth.helpExpress.bind(everyauth);
};
