var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , _schema = require('./schema')
  , everyauth = require('everyauth');
mongooseTypes.loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;

module.exports = function facebook (schema, opts) {
  schema.add(_schema);

  schema.static('createWithFB', function (fbUserMeta, accessToken, expires, callback) {
    var expiresDate = new Date;
    expiresDate.setSeconds(expiresDate.getSeconds() + expires);

    var params =  {
      fb: {
          id: fbUserMeta.id
        , accessToken: accessToken
        , expires: expiresDate
        , name: {
              full: fbUserMeta.name
            , first: fbUserMeta.first_name
            , last: fbUserMeta.last_name
          }
        , alias: fbUserMeta.link.match(/^http:\/\/www.facebook\.com\/(.+)/)[1]
        , gender: fbUserMeta.gender
        , email: fbUserMeta.email
        , timezone: fbUserMeta.timezone
        , locale: fbUserMeta.locale
        , verified: fbUserMeta.verified
        , updatedTime: fbUserMeta.updated_time
      }
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "fb:" + fbUserMeta.id; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });
};
