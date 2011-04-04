var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);
var Url = mongoose.SchemaTypes.Url;

// See http://dev.twitter.com/doc/get/users/show
module.exports = function facebook (schema, opts) {
  schema.add({
    twit: {
        id: String
      , name: String
      , screenName: String
      , location: String
      , description: String
      , profile_image_url: String
      , url: Url
      , protected: Boolean
      , followersCount: Number
      , profileBackgroundColor: String
      , profileTextColor: String
      , profileLinkColor: String
      , profileSidebarFillColor: String
      , profileSidebarBorderColor: String
      , friendsCount: Number
      , createdAt: Date
      , favouritesCount: Number
      , utcOffset: Number
      , timeZone: String
      , profileBackgroundImageUrl: String
      , profileBackgroundTile: Boolean
      , profileUseBackgroundImage: Boolean
//      , notifications: Boolean
      , geoEnabled: Boolean
      , verified: Boolean
//      , following: Boolean
      , statusesCount: Number
      , lang: String
      , contributorsEnabled: Boolean
//      , status: StatusSchema // only if public or you follow them + protected
    }
  });
};
