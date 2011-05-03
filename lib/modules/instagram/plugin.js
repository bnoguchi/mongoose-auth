var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , _schema = require('./schema')
  , everyauth = require('everyauth');
mongooseTypes.loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;

module.exports = function instagram (schema, opts) {
  schema.add(_schema);

  schema.static('createWithInstagram', function (hipster, accessToken, callback) {
    var params = {
      instagram: {
          id: hipster.id
        , name: {
              first: hipster.first_name
            , last: hipster.last_name
          }
        , profilePicture: hipster.profile_picture
        , counts: {
              media: hipster.counts.media
            , follows: hipster.counts.follows
            , followedBy: hipster.counts.followed_by
          }
      }
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "instagram:" + hipster.id; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });
};
