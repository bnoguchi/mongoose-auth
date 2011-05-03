var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , _schema = require('./schema')
  , everyauth = require('everyauth');
mongooseTypes.loadTypes(mongoose);
var Url = mongoose.SchemaTypes.Url;

// See http://dev.twitter.com/doc/get/users/show
module.exports = function twitter (schema, opts) {
  schema.add(_schema);

  schema.static('createWithTwitter', function (twitUserMeta, accessToken, accessTokenSecret, callback) {
    var params = {
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
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "twit:" + twitUserMeta.id; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });
};
