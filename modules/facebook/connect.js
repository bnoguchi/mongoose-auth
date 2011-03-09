var connectAuth = require('connect-auth');

exports.connectAuth = function (opts) {
  return connectAuth.Twitter({
      appId: opts.key
    , appSecret: opts.secret
    , scope: opts.scope
    , callback: opts.callback});
};

exports.router = function (app, opts) {
  var User = opts.User
    , redirect = opts.redirect;

  app.get('/auth/facebook', function (req, res) {
    req.authenticate(['facebook'], function (err, authenticated) {
      if (err) throw new Error(err);
      if (!authenticated) return;
      var fbUser = req.getAuthDetails().user;
      User.where({fbId: fbUser.id}).findOne(function (err, foundUser) {
        if (err) throw err;
        if (foundUser) {
          req.session.auth.userId = foundUser._id;
          res.redirect(redirect); // TODO Can I just send back JavaScript?
        } else {
          User.create({
            fb: {
                id: fbUser.id
              , name: {
                    full: fbUser.name
                  , first: fbUser.first_name
                  , last: fbUser.last_name
                }
              , alias: fbUser.link.match(/^http:\/\/www.facebook\.com\/(.+)/)[1]
              , gender: fbUser.gender
              , email: fbUser.email
              , timezone: fbUser.timezone
              , locale: fbUser.locale
              , verified: fbUser.verified
              , updatedTime: fbUser.updated_time
            }
          }, function (err, createdUser) {
            if (!err) {
              req.session.auth.userId = createdUser._id;
              res.redirect(redirect); // TODO Can I just send back JavaScript?
            } else {
              console.log(err);
              throw err;
              res.redirect('/');
            }
          });
        }
      });
    });
  });
};
