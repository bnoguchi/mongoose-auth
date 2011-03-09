var connectAuth = require('connect-auth');

exports.router = function (app, opts) {
  var User = opts.User
    , redirect = opts.redirect;

  app.post('/login', function (req, res) {
    var uname = req.param('username')
      , password = req.param('password');
    User.authenticate(uname, password, function (err, user) {
      req.session.auth.userId = user._id;
      res.redirect(redirect);
    });
  });
};
