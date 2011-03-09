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
