var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;

module.exports = function instagram (schema, opts) {
  schema.add({
      instagram: {
          id: String
        , username: String
        , name: {
              first: String
            , last: String
          }
        , profilePicture: String
        , counts: {
              media: Number
            , follows: Number
            , followedBy: Number
          }
      }
  });

  schema.static('createWithInstagram', function (hipster, accessToken, callback) {
    this.create({
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
    }, callback);
  });
};
