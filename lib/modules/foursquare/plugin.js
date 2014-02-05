var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , _schema = require('./schema')
  , everyauth = require('everyauth');
mongooseTypes.loadTypes(mongoose);
var Url = mongoose.SchemaTypes.Url;

everyauth.debug = true;

// See https://developer.foursquare.com/docs/responses/user
module.exports = function foursquare (schema, opts) {
  schema.add(_schema);

  schema.static('createWithFoursquare', function (foursquareUserMeta, accessToken, accessTokenExtra, callback) {
    var params = {
      foursquare: {
          accessToken: accessToken
        , id: foursquareUserMeta.id
        , firstName: foursquareUserMeta.firstName
        , lastName: foursquareUserMeta.lastName
        , homeCity: foursquareUserMeta.homeCity
        , photo: foursquareUserMeta.photo
        , gender: foursquareUserMeta.gender
        , relationship: foursquareUserMeta.relationship
        , type: foursquareUserMeta.type
        , contact: foursquareUserMeta.contact
        , pings: foursquareUserMeta.pings
        , badges: foursquareUserMeta.badges
        , checkins: foursquareUserMeta.checkins
        , mayorships: foursquareUserMeta.mayorships
        , tips: foursquareUserMeta.tips
        , todos: foursquareUserMeta.todos
        , photos: foursquareUserMeta.photos
        , friends: foursquareUserMeta.friends
        , followers: foursquareUserMeta.followers
        , requests: foursquareUserMeta.requests
        , pageInfo: foursquareUserMeta.pageInfo
      }
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "foursquare:" + foursquareUserMeta.id; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });
};
