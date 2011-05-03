module.exports = {
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
};
