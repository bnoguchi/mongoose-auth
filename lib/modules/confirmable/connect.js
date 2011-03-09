module.exports = function routes (app) {
  app.get('/confirmation/new', function (req, res) {
    res.render('./view.jade');
  });

  app.post('/confirmation', function (req, res)  {
    // TODO Send confirmation instructions via email
  });

  app.get('/confirmation/:confirmation_token', function (req, res) {
    var token = req.param('confirmation_token');
    // TODO import User
    User.findOne({confirmation_token: token}, function (err, user) {
      if (user.isPersisted())
        user.confirm();
        // TODO sign in
        // TODO Set flash messages
        res.redirect('/');
    });
  });
};
