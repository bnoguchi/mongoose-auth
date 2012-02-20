module.exports = {
    github: {
        id: Number
      , accessToken: String
      , login: String
      , gravatarId: String
      , name: String
      , email: String
      , publicRepoCount: Number
      , publicGistCount: Number
      , followingCount: Number
      , followersCount: Number
      , company: String
      , blog: String
      , location: String
      , permission: String
      , createdAt: Date

      // Private data
      , totalPrivateRepoCount: Number
      , collaborators: Number
      , diskUsage: Number
      , ownedPrivateRepoCount: Number
      , privateGistCount: Number
      , plan: {
            name: String
          , collaborators: Number
          , space: Number
          , privateRepos: Number
        }
    }
  , 'github.type': String
};
