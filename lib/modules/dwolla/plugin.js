var mongoose = require('mongoose')
  , _schema = require('./schema')
  , everyauth = require('everyauth');

module.exports = function dwolla(schema, opts) {
  schema.add(_schema);

  schema.static('createWithDwolla', function (dUserMeta, accessToken, callback) {

    var params =  {
      dwolla: {
        id          : dUserMeta.Id
      , accessToken : accessToken
      , city        : dUserMeta.City
      , latitude    : dUserMeta.Latitude
      , longitude   : dUserMeta.Longitude
      , name        : dUserMeta.Name
      , state       : dUserMeta.State
      , type        : dUserMeta.Type
      }
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "dwolla:" + dUserMeta.Id; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });

  schema.method('updateDwollaData', function (dUserMeta, accessToken, callback) {
    var foundUser = this;

    foundUser.dwolla = {
        id          : dUserMeta.Id
      , accessToken : accessToken
      , city        : dUserMeta.City
      , latitude    : dUserMeta.Latitude
      , longitude   : dUserMeta.Longitude
      , name        : dUserMeta.Name
      , state       : dUserMeta.State
      , type        : dUserMeta.Type
    };

    foundUser.save(function(err){
      callback(err, foundUser);
    });
  });
};
