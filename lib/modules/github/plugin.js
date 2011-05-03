var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , _schema = require('./schema')
  , everyauth = require('everyauth');
mongooseTypes.loadTypes(mongoose);
var Email = mongoose.SchemaTypes.Email;

module.exports = function github (schema, opts) {
  schema.add(_schema);

  schema.static('createWithGithub', function (ghUser, accessToken, callback) {
    var params = {
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
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "github:" + ghUser.id; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });
};
