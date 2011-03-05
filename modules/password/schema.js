var bcrypt = require('bcrypt');

module.exports = function (schema, opts) {
  schema.add({
      login: { type: String, required: true }
  });

  schema.virtual('password').get( function () {
    return this._password;
  }).set( function (password) {
    this._password = password;
    var salt = this.salt = bcrypt.gen_salt(10);
    this.hash = bcrypt.hashpw(password, salt);
  });

  schema.method('authenticate', function (password) {
    return bcrypt.compare(password, this.hash);
  });
};
