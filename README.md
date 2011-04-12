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
- `github`
- `instagram`

mongoose-auth does 3 things:

1. Schema decoration
2. (optional) Drop in routing for 
   (connect)[https://github.com/senchalabs/connect] apps.
3. (optional) Dynamic helpers for 
   (express)[https://github.com/visionmedia/express] apps.

It integrates the [everyauth](https://github.com/bnoguchi/everyauth) module
to help it take care of the routing and helpers. everyauth is a general
purpose npm module for authentication & authorization that can be used
independently of mongoose.

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
    UserSchema.plugin(mongooseAuth, {
      facebook: true
    });

## Beyond Schema Decoration: Routing

Applications require more than just User Schema augmentation in order
to implement a complete authorization strategy. Applications also need
routes exposing the one or more steps involved for a given authorization
strategy. Moreover, applications each handle in their own unique way how
they want to respond to successful or failed logins (in addition to logout
handling). If you are not using a 
(connect)[https://github.com/senchalabs/connect], then you will have to
set all of this up yourself. In this case, mongoose-auth *only* provides
you with Schema decoration.

But, if you are building your app on top of
(connect)[https://github.com/senchalabs/connect], then mongoose-auth
provides drop in solutions for you. Here is how you can get access
to the routing that mongoose-auth provides. Not the "STEP X: ..."
comments:

    var mongoose = require('mongoose')
      , Schema = mongoose.Schema
      , mongooseAuth = require('mongoose-auth');
    
    var UserSchema = new Schema({})
      , User;
   
    // STEP 1: Schema Decoration and Configuration for the Routing
    UserSchema.plugin(mongooseAuth, {
        facebook: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: 'YOUR APP ID HERE'
            , appSecret: 'YOUR APP SECRET HERE'
            , redirectPath: '/'
            , User: function () {
                return User;
              }
          }
        }
    });
   
    mongoose.model('User', UserSchema);

    mongoose.connect('mongodb://localhost/example');

    User = mongoose.model('User');

    var app = express.createServer(
        express.bodyParser()
      , express.static(__dirname + "/public")
      , express.cookieParser()
      , express.session({ secret: 'esoognom'})
      
        // STEP 2: Add in the Routing
      , mongooseAuth.middleware()
    );
   
    // STEP 3: Add in Dynamic View Helpers 
    mongooseAuth.helpExpress(app);

    app.listen(3000);

## Using Multiple Authorization Strategies at Once

You can also use multiple authorization strategies in the same application.
Here is an example, using 5 authorization strategies:

    // A configuration file for holding all of your
    // 3rd party OAuth credentials
    var conf = require('./conf');
    // A configuration file for holding all of your
    // 3rd party OAuth credentials
    var conf = require('./conf');
    UserSchema.plugin(mongooseAuth, {
        facebook: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: conf.fb.appId
            , appSecret: conf.fb.appSecret
            , redirectPath: '/'
            , User: function () {
                return User;
              }
          }
        }
      , twitter: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , consumerKey: conf.twit.consumerKey
            , consumerSecret: conf.twit.consumerSecret
            , redirectPath: '/'
            , User: function () {
                return User;
              }
          }
        }
      , password: {
            everyauth: {
                getLoginPath: '/login'
              , postLoginPath: '/login'
              , loginView: 'login.jade'
              , getRegisterPath: '/register'
              , postRegisterPath: '/register'
              , registerView: 'register.jade'
              , redirectPath: '/'
              , User: function () {
                  return User;
                }
            }
        }
      , github: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: conf.github.appId
            , appSecret: conf.github.appSecret
            , redirectPath: '/'
            , User: function () {
                return User;
              }
          }
        }
      , instagram: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: conf.instagram.clientId
            , appSecret: conf.instagram.clientSecret
            , redirectPath: '/'
            , User: function () {
                return User;
              }
          }
        }
    });

## Example

There is an example app located in [./example](https://github.com/bnoguchi/mongoose-auth/tree/master/example).
To run it:

    $ cd example
    $ node server.js

Then navigate to [http://localhost:3000/](http://localhost:3000)

### License
MIT License

---
### Author
Brian Noguchi
