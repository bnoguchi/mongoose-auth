var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;

module.exports = function facebook (schema, opts) {
  schema.add({
    fb: {
        id: Number
      , name: {
            full: String
          , first: String
          , last: String
        }
      , fbAlias: String
      , gender: String
      , email: Email
      , timezone: String
      , locale: String
      , verified: Boolean
      , updatedTime: String
      , phone: String
    }
  });
};
