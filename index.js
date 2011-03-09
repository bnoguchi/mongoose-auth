var connect = require('connect')
  , connectAuth = require('connect-auth');

var Modules = {
    password: require('./modules/password')
  , facebook: require('./modules/facebook')
  , twitter: require('./modules/twitter')
};

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

exports.connect = function (config) {
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
