module.exports = {
  twit: {
      accessToken: String
    , accessTokenSecret: String
    , id: String
    , name: String
    , screenName: String
    , location: String
    , description: String
    , profileImageUrl: String
    , url: String // TODO Convert to URL from mongoose-types
    , 'protected': Boolean
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
//    , notifications: Boolean
    , geoEnabled: Boolean
    , verified: Boolean
//    , following: Boolean
    , statusesCount: Number
    , lang: String
    , contributorsEnabled: Boolean
//    , status: StatusSchema // only if public or you follow them + protected
  }
};
