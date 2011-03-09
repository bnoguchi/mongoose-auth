var connectAuth = require('connect-auth');

exports.connectAuth = function (opts) {
  return connectAuth.Twitter({
      consumerKey: opts.key
    , consumerSecret: opts.secret});
};

exports.router = function (app, opts) {
  var User = opts.User;

  app.get ('/auth/twitter', function(req, res, params) {
    req.authenticate(['twitter'], function(error, authenticated) { 
      if( authenticated ) {
        res.redirect("/");
  //      var oa= new OAuth("http://twitter.com/oauth/request_token",
  //                        "http://twitter.com/oauth/access_token",
  //                        twitterConsumerKey,
  //                        twitterConsumerSecret,
  //                        "1.0",
  //                        null,
  //                        "HMAC-SHA1");
  //      oa.getProtectedResource("http://twitter.com/statuses/user_timeline.xml", "GET",
  //                              req.getAuthDetails()["twitter_oauth_token"], req.getAuthDetails()["twitter_oauth_token_secret"],  function (error, data) {
  //          res.writeHead(200, {'Content-Type': 'text/html'})
  //          res.end("<html><h1>Hello! Twitter authenticated user ("+req.getAuthDetails().user.username+")</h1>"+data+ "</html>")
  //      });
      }
      else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end("<html><h1>Twitter authentication failed :( </h1></html>");
      }
    });
});

};
