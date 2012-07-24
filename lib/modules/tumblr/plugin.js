var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , _schema = require('./schema')
  , everyauth = require('everyauth');
mongooseTypes.loadTypes(mongoose);
var Url = mongoose.SchemaTypes.Url;

module.exports = function tumblr (schema, opts) {
  schema.add(_schema);

  schema.static('createWithTumblr', function (tumblrUserMeta, accessToken, accessTokenSecret, callback) {
    var params = {
      tumblr: {
          accessToken: accessToken
        , accessTokenSecret: accessTokenSecret
        , name: tumblrUserMeta.name
        , title: tumblrUserMeta.title
        , url: tumblrUserMeta.url
        , avatarUrl: tumblrUserMeta['avatar-url']
      }
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "tumblr:" + tumblrUserMeta.name; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });
};
