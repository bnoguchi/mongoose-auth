var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;

module.exports = function github (schema, opts) {
  schema.add({
      github: {
          id: Number
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
  });

  schema.static('createWithGithub', function (ghUser, accessToken, callback) {
    this.create({
      github: {
          id: ghUser.id
        , type: ghUser.type
        , login: ghUser.login
        , gravatarId: ghUser.gravatar_id
        , name: ghUser.name
        , email: ghUser.email
        , publicRepoCount: ghUser.public_repo_count
        , publicGistCount: ghUser.public_gist_count
        , followingCount: ghUser.following_count
        , followersCount: ghUser.followers_count
        , company: ghUser.company
        , blog: ghUser.blog
        , location: ghUser.location
        , permission: ghUser.permission
        , createdAt: ghUser.created_at

        // Private data
        , totalPrivateRepoCount: ghUser.total_private_repo_count
        , collaborators: ghUser.collaborators
        , diskUsage: ghUser.disk_usage
        , ownedPrivateRepoCount: ghUser.owned_private_repo_count
        , privateGistCount: ghUser.private_gist_count
        , plan: {
              name: ghUser.plan.name
            , collaborators: ghUser.plan.collaborators
            , space: ghUser.plan.space
            , privateRepos: ghUser.plan.private_repos
          }
      }
    }, callback);
  });
};
