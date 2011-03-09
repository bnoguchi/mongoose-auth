mongoose-auth
=============

User authentication plugin for mongoose node.js orm

It aims to be a flexible authentication solution for node.js apps.

- It supports password logins; OAuth for Twitter, Facebook, LinkedIn, Github, and more.
- It is Connect based.
- It is modular, so you use only what you need.
- It is configurable, so you can bend it to your will.

We have modules for:

- `dbAuthenticatable`
- `tokenAuthenticatable`
- `confirmable`
- `recoverable`
- `registration`
- `rememberable`
- `lockable`
- `trackable`
- `validatable`
- `timeoutable`
- `encryptable`

We also have drop in helpers for express, so you do not have to write your
own request handlers and views for common scenarios. This drop-in also
enables you to easily check that a user is logged in before passing a
request along to the given url handler.

We hope to support all of the following logins eventually (list borrowed from OmniAuth):

- OAuth
  - 37signals ID
  - Bit.ly
  - Dopplr
  - Facebook
  - Foursquare
  - GitHub
  - GoodReads
  - Gowalla
  - Hyves
  - Identi.ca
  - LinkedIn
  - Meetup
  - Netflix
  - SmugMug
  - SoundCloud
  - TripIt
  - Twitter
  - Vimeo
  - YouTube
  - Miso
  - DailyMile
  - Instagram
  - Mixi
  - Evernote
- Flickr
- OpenID
- Google Apps (via OpenID)
- CAS (Central Authentication Service)
- LDAP

`mongoose-auth` draws inspiration from [`devise`](https://github.com/plataformatec/devise) for Rails.

The following is an API proposal:

### Installation
    $ npm install mongoose-auth

### How to use
`mongoose-auth` is simple to use via `mongoose` plugin support.
    var mongoose = require('mongoose')
      , db = mongoose.createConnection('mongodb://localhost/sampledb')
      , authPlugin = require('mongoose-auth')
      , UserSchema = new Schema();
    
    UserSchema.plugin(authPlugin);

You also can configure the plugin with configuration options:
    UserSchema.plugin(authPlugin, {
        password: true
      , confirmable: true
    });

The meat and butter API calls are demonstrated here:
    mongoose.model('User', UserSchema);
    var User = mongoose.model('User');
    var user = findOne({login: 'username'}, function (err, user) {
      if (user.authenticate('some-password')) {
      }
    });

### Facebook login
    UserSchema.plugin(authPlugin, {
      facebook: {
          appId: "APP_ID"
        , appSecret: "APP_SECRET"
      }
    });
