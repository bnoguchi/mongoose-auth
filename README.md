mongoose-auth
=============

User authentication plugin for mongoose node.js orm.

mongoose-auth enables you to support authorization in any number of ways
via authorization strategies.

An authorization strategy is how you authorize your user. Currently
mongoose-auth supports the following authorization strategies:

- `password`
- `facebook`
- `twitter`

mongoose-auth does 2 things:

1. Schema decoration
2. (optional) Drop in routing and event handling for (connect)[https://github.com/senchalabs/connect]
   apps.

## Schema Decoration

As you add successive authorization strategies, mongoose-auth at a bare
minimum augments your schema with typed attributes corresponding to parameters
related to your chosen authorization strategies. For example, if facebook is 
one of your authorization strategies, then it will add attributes to your 
User Schema such as 'fb.id' and 'fb.email'.

To decorate your schema:
    var mongoose = require('mongoose')
      , Schema = mongoose.Schema
      , mongooseAuth = require('mongoose-auth');
    
    var UserSchema = new Schema({});
    UserSchema.plugin(mongooseAuth.authPlugin, {
      facebook: true
    });

## Beyond Schema Decoration: Routing and Event Handling

Applications require more than just User Schema augmentation in order
to implement a complete authorization strategy. Applications also need
routes exposing the one or more steps involved for a given authorization
strategy. Moreover, applications each handle in their own unique way how
they want to respond to successful or failed logins (in addition to logout
handling). If you are not using a 
(connect)[https://github.com/senchalabs/connect], then you will have to
set all of this up yourself. In this case, mongoose-auth only provides
you with Schema decoration.

But, if you are building your app on top of
(connect)[https://github.com/senchalabs/connect], then mongoose-auth
provides drop in solutions for:

1. Complete routing and event handling support for the authorization strategies. What this means is:
   - Set up routes to support every step involved in an auth strategy.
   - Exposing important events (e.g., `authSucceed`, `logout`), so the
     developer can define exactly how (s)he wants the application to handle
     each type of authorization event.
2. Routing and event handling support for other desired authorization features such as
   - Registration confirmation by email
   - Password recovery
   - Remembering logins via persistent cookies
   - Locking a user out after X successive failed logins
   - Tracking user login activity
   - Logging a user out after a timeout of a certain amount of time

mongoose-auth tries to be modular and comprehensive.

## Old README

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
