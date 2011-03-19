var connect = require('connect')
  , connectAuth = require('connect-auth');

var Modules = {
    password: require('./lib/modules/password')
  , facebook: require('./lib/modules/facebook')
  , twitter: require('./lib/modules/twitter')
};

/**
 * Decorates the (User) Schema with the proper
 */
exports.authPlugin = function (schema, opts) {
  var moduleName
    , decorate
    , moduleOpts;
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

/**
 * mongoose-auth exposes events for which you can define handlers.
 * The events are defined in the context of the authorization
 * process. Moreover, there are module specific events for
 * important phases of e.g., Facebook OAuth:
 *
 * Events
 * =======
 * 1. User attempts to login via one of the module strategies (e.g., facebook)
 * 2. Authorization occurs via the specified module's approach
 *    a. `authorizeSucceed`, invoking handlers function (req, res, authData)
 *    b. `authorizeFail`, invoking handlers function (req, res, err)
 * 3. If the user was not already logged in pre-authorization, then log that person in
 *    and redirect them to another page.
 * 4. If the user was already logged in pre-authorization, then attach any module authData
 *    to the currently logged in user. Additionally, the developer can choose a redirect
 *    destination
 *
 * mongooseAuth.init({
 *     User: User
 *   , modules: {
 *         password: {
 *         }
 *       , facebook: {
 *             apiKey: ''
 *           , apiSecret: ''
 *           , on: {
 *                 authorizeSucceed: function (req, res, fbData) {
 *                 }
 *               , authorizeFail: function (req, res, err) {
 *                 }
 *             }
 *         }
 *       , twitter: {
 *         }
 *     }
 *   , on: {
 *         loginSuccess: function (req, res, user) {
 *         }
 *       , loginFail: function (req, res, err) {
 *         }
 *       , logout: function (req, res) {
 *         }
 *     }
 * });
 */
exports.init = function (config) {
  var modules = config.modules;
  if (!modules) {
    throw new Error("You must specify at least one module.");
  }

  var middleware = function () {
    var connectAuthModules = []
      , moduleOpts;
    for (var moduleName in modules) {
      moduleOpts = modules[moduleName];
      if (Modules[moduleName].connectAuth) {
//        moduleOpts.on || (moduleOpts.on = {});
        connectAuthModules.push(
          Modules[moduleName].connectAuth(moduleOpts)
        );
      }
    }

    var server = connect(
        connectAuth(connectAuthModules)
    );

    return server;
  };

  var router = function () {
    return connect.router(function (app) {
      var moduleOpts;
      for (var moduleName in modules) {
        moduleOpts = modules[moduleName];
        try {
          Modules[moduleName].router(app, moduleOpts);
        } catch (e) {
          throw new Error('Module ' + moduleName + ' has no router defined');
        }
      }

      app.get('/logout', function (req, res) {
        delete req.session.auth.userId;
        req.logout(); // Defined by connect-auth
        res.writeHead(303, { 'Location': '/'}); // Make Location configurable
        res.end('');
      });
    });
  };

  return {
      middleware: middleware
    , router: router
  };

};
