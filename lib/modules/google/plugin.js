var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , _schema = require('./schema')
  , everyauth = require('everyauth');
mongooseTypes.loadTypes(mongoose);

module.exports = function google (schema, opts) {
  schema.add(_schema);

  schema.static('createWithGoogleOAuth', function (googleUser, accessToken, accessTokenExtra, callback) {
    var expiresDate = new Date;
    expiresDate.setSeconds(expiresDate.getSeconds() + accessTokenExtra.expires_in);
    
    var params = {
      google: {
          email: googleUser.id
        , expires: expiresDate
        , accessToken: accessToken
        , refreshToken: accessTokenExtra.refresh_token
      }
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "google:" + googleUser.id; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });
};