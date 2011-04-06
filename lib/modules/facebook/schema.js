var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;

module.exports = function facebook (schema, opts) {
  schema.add({
    fb: {
        id: String
      , name: {
            full: String
          , first: String
          , last: String
        }
      , fbAlias: String
      , gender: String
      , email: String
//      , email: Email // TODO Try to add Email type back in
                       //      Broken because of require behavior
      , timezone: String
      , locale: String
      , verified: Boolean
      , updatedTime: String
      , phone: String
    }
  });

  schema.static('createWithFB', function (fbUserMeta, accessToken, callback) {
    User.create({
      fb: {
          id: fbUserMeta.id
        , accessToken: accessToken
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
    }, callback);
  });
};
