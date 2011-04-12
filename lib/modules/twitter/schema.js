var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);
var Url = mongoose.SchemaTypes.Url;

// See http://dev.twitter.com/doc/get/users/show
module.exports = function twitter (schema, opts) {
  schema.add({
    twit: {
        accessToken: String
      , accessTokenSecret: String
      , id: String
      , name: String
      , screenName: String
      , location: String
      , description: String
      , profileImageUrl: String
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

  schema.static('createWithTwitter', function (twitUserMeta, accessToken, accessTokenSecret, callback) {
    this.create({
      twit: {
          accessToken: accessToken
        , accessTokenSecret: accessTokenSecret
        , id: twitUserMeta.id
        , name: twitUserMeta.name
        , screenName: twitUserMeta.screen_name
        , location: twitUserMeta.location
        , description: twitUserMeta.description
        , profileImageUrl: twitUserMeta.profile_image_url
        , url: twitUserMeta.url
        , protected: twitUserMeta.protected
        , followersCount: twitUserMeta.followers_count
        , profileBackgroundColor: twitUserMeta.profile_background_color
        , profileTextColor: twitUserMeta.profile_text_color
        , profileLinkColor: twitUserMeta.profile_link_color
        , profileSidebarFillColor: twitUserMeta.profile_sidebar_fill_color
        , profileSiderbarBorderColor: twitUserMeta.profile_sidebar_border_color
        , friendsCount: twitUserMeta.friends_count
        , createdAt: twitUserMeta.created_at
        , favouritesCount: twitUserMeta.favourites_count
        , utcOffset: twitUserMeta.utc_offset
        , timeZone: twitUserMeta.time_zone
        , profileBackgroundImageUrl: twitUserMeta.profile_background_image_url
        , profileBackgroundTile: twitUserMeta.profile_background_tile
        , profileUseBackgroundImage: twitUserMeta.profile_use_background_image
        , geoEnabled: twitUserMeta.geo_enabled
        , verified: twitUserMeta.verified
        , statusesCount: twitUserMeta.statuses_count
        , lang: twitUserMeta.lang
        , contributorsEnabled: twitUserMeta.contributors_enabled
      }
    }, callback);
  });
};
