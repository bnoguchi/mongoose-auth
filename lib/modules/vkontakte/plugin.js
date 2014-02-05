var mongoose = require('mongoose')
  , mongooseTypes = require('mongoose-types')
  , _schema = require('./schema')
  , everyauth = require('everyauth');
mongooseTypes.loadTypes(mongoose);

function parseDate(str) {
    if (!str) {

        return null;
    }

    var splited = str.split('.'),
        date = new Date()
    ;
    date.setFullYear(splited[2], +splited[1] - 1, splited[0]);

    return date;
}

module.exports = function facebook (schema, opts) {
  schema.add(_schema);

  schema.static('createWithVK', function (vkUserMeta, accessToken, expires, callback) {
    var expiresDate = new Date;
    expiresDate.setSeconds(expiresDate.getSeconds() + expires);
    var params =  {
      vk: {
          id: vkUserMeta.uid
        , accessToken: accessToken
        , expires: expiresDate
        , name: {
              first: vkUserMeta.first_name
            , last: vkUserMeta.last_name
            , nickname: vkUserMeta.nick_name
            , screen_name: vkUserMeta.screen_name
          }
        , sex: vkUserMeta.sex
        , bdate: parseDate(vkUserMeta.bdate)
        , city: vkUserMeta.city
        , country: vkUserMeta.country
        , timezone: vkUserMeta.timezone
        , photo: vkUserMeta.photo
        , photo_medium: vkUserMeta.photo_medium
        , photo_big: vkUserMeta.photo_big
        , has_mobile: vkUserMeta.has_mobile
        , rate: vkUserMeta.rate
        , university: vkUserMeta.university
        , university_name: vkUserMeta.university_name
        , faculty: vkUserMeta.faculty
        , faculty_name: vkUserMeta.faculty_name
        , graduation: vkUserMeta.graduation
      }
    };

    // TODO Only do this if password module is enabled
    //      Currently, this is not a valid way to check for enabled
    if (everyauth.password)
      params[everyauth.password.loginKey()] = "vk:" + vkUserMeta.uid; // Hack because of way mongodb treate unique indexes

    this.create(params, callback);
  });
};
