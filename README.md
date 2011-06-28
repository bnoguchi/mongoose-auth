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
   [connect](https://github.com/senchalabs/connect) apps.
3. (optional) Dynamic helpers for 
   [express](https://github.com/visionmedia/express) apps.

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

```javascript
    var mongoose = require('mongoose')
      , Schema = mongoose.Schema
      , mongooseAuth = require('mongoose-auth');
    
    var UserSchema = new Schema({});
    UserSchema.plugin(mongooseAuth, {
      facebook: true
    });
```

## Beyond Schema Decoration: Routing

Applications require more than just User Schema augmentation in order
to implement a complete authorization strategy. Applications also need
routes exposing the one or more steps involved for a given authorization
strategy. Moreover, applications each handle in their own unique way how
they want to respond to successful or failed logins (in addition to logout
handling). If you are not using a 
[connect](https://github.com/senchalabs/connect), then you will have to
set all of this up yourself. In this case, mongoose-auth *only* provides
you with Schema decoration.

But, if you are building your app on top of
[connect](https://github.com/senchalabs/connect), then mongoose-auth
provides drop in solutions for you. Here is how you can get access
to the routing that mongoose-auth provides. Not the "STEP X: ..."
comments:

```javascript
    var mongoose = require('mongoose')
      , Schema = mongoose.Schema
      , mongooseAuth = require('mongoose-auth');
    
    var UserSchema = new Schema({})
      , User;
   
    // STEP 1: Schema Decoration and Configuration for the Routing
    UserSchema.plugin(mongooseAuth, {
        // Here, we attach your User model to every module
        everymodule: {
          everyauth: {
              User: function () {
                return User;
              }
          }
        }
        
      , facebook: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: 'YOUR APP ID HERE'
            , appSecret: 'YOUR APP SECRET HERE'
            , redirectPath: '/'
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

        // IMPORTANT!!!!!!! Do not add app.router, to your middleware chain 
        // explicitly, or you will run into problems accessing `req.user`
        // i.e., do not use app.use(app.router). Let express do this for you
        // automatically for you upon your first app.get or app.post.
    );
   
    // STEP 3: Add in Dynamic View Helpers (only if you are using express)
    mongooseAuth.helpExpress(app);

    app.listen(3000);
```

## View Helpers and Convenience Methods & Getters

In "Step 3" of the last code sample, we are adding dynamic view helpers, for if
you are using the [Express](https://github.com/visionmedia/express) web framework.
This automically gives you access to a convenient `everyauth` local variable from
your view, so you do not have to pass `req` as a local to your view:

- `everyauth.loggedIn` - a Boolean getter that tells you if the request is by a logged in user
- `everyauth.user` - the mongoose User document associated with the session
- `everyauth.facebook` - The is equivalent to what is stored at `req.session.auth.facebook`, 
  so you can do things like ...
- `everyauth.facebook.user` - returns the user json provided from the OAuth provider.
- `everyauth.facebook.accessToken` - returns the access_token provided from the OAuth provider
  for authorized API calls on behalf of the user.
- And you also get this pattern for other modules - e.g., `everyauth.twitter.user`, 
  `everyauth.github.user`, etc.

You also get access to the view helper

- `user` - the same as `everyauth.user` above

As an example of how you would use these, consider the following `./views/user.jade` jade template:

    .user-id
      .label User Id
      .value #{user.id}
    .facebook-id
      .label User Facebook Id
      .value #{everyauth.facebook.user.id}

The "STEP 2: Add in the Routing" step in the last code sample also provides convenience methods on the
`ServerRequest` instance `req`. From any scope that has access to `req`, you get the following
convenience getter and method:

- `req.loggedIn` - a Boolean getter that tells you if the request is by a logged in user
- `req.user`     - the mongoose User document associated with the session
- `req.logout()` - clears the sesion of your auth data

## Using Multiple Authorization Strategies at Once

You can also use multiple authorization strategies in the same application.
Here is an example, using 5 authorization strategies:

```javascript
    // A configuration file for holding all of your
    // 3rd party OAuth credentials
    var conf = require('./conf');
    // A configuration file for holding all of your
    // 3rd party OAuth credentials
    var conf = require('./conf');
    UserSchema.plugin(mongooseAuth, {
        // Here, we attach your User model to every module
        everymodule: {
          everyauth: {
              User: function () {
                return User;
              }
          }
        }
      , facebook: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: conf.fb.appId
            , appSecret: conf.fb.appSecret
            , redirectPath: '/'
          }
        }
      , twitter: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , consumerKey: conf.twit.consumerKey
            , consumerSecret: conf.twit.consumerSecret
            , redirectPath: '/'
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
              , loginSuccessRedirect: '/'
              , registerSuccessRedirect: '/'
            }
        }
      , github: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: conf.github.appId
            , appSecret: conf.github.appSecret
            , redirectPath: '/'
          }
        }
      , instagram: {
          everyauth: {
              myHostname: 'http://localhost:3000'
            , appId: conf.instagram.clientId
            , appSecret: conf.instagram.clientSecret
            , redirectPath: '/'
          }
        }
    });
```

## Example

There is an example app located in [./example](https://github.com/bnoguchi/mongoose-auth/tree/master/example).
To run it:

    $ cd example
    $ node server.js

Then navigate to [http://localhost:3000/](http://localhost:3000)

## Recipe 1: Linking Multiple Account Logins Together

A common recipe is allowing a user to login via multiple accounts *and* to link those accounts under one user
document.

This can be done in the following way:

The real magic lies with https://github.com/bnoguchi/everyauth/, and it should be more obvious once 
I document everyauth more and document mongoose-auth's relationship to everyauth.

In `everyauth`'s design, every auth module is defined as a set of steps, which are exposed in such a way for 
you to over-ride. The step that is of particular interest for this scenario is the `findOrCreateUser` step 
required by every `everyauth` module.  `mongoose-auth` defines a default version of this `findOrCreateUser` 
step for each `everyauth` auth module it supports (You can find these default definitions in 
"lib/modules/#{moduleName}/everyauth.js" -- e.g., see 
[.lib/modules/facebook/everyauth.js](https://github.com/bnoguchi/mongoose-auth/tree/master/lib/modules/facebook/everyauth.js)).

So for example, this is how you would over-ride the default `findOrCreateUser` step for the 
facebook module if you are using both the facebook and password module:

```javascript
UserSchema.plugin(mongooseAuth, {
  facebook: {
    everyauth: {
        myHostname: ...
      , ...
      , findOrCreateUser: function (session, accessTok, accessTokExtra, fbUser) {
          var promise = this.Promise()
              , User = this.User()();
          User.findById(session.auth.userId, function (err, user) {
            if (err) return promise.fail(err);
            if (!user) {
              User.where('password.login', fbUser.email).findOne( function (err, user) {
                if (err) return promise.fail(err);
                if (!user) {
                  User.createWithFB(fbUser, accessTok, accessTokExtra.expires, function (err, createdUser) {
                    if (err) return promise.fail(err);
                    return promise.fulfill(createdUser);
                  });
                } else {
                  assignFbDataToUser(user, accessTok, accessTokExtra, fbUser);
                  user.save( function (err, user) {
                    if (err) return promise.fail(err);
                    promise.fulfill(user);
                  });
                }
              });
            } else {
              assignFbDataToUser(user, accessTok, accessTokExtra, fbUser);
              
              // Save the new data to the user doc in the db
              user.save( function (err, user) {
                if (err) return promise.fail(err);
                promise.fuilfill(user);
              });
            }
          });
        });
        return promise; // Make sure to return the promise that promises the user
      }
  }
});

// Assign all properties - see lib/modules/facebook/schema.js for details
function assignFbDataToUser (user, accessTok, accessTokExtra, fbUser) {
  user.fb.accessToken = accessTok;
  user.fb.expires = accessTokExtra.expires;
  user.fb.id = fbUser.id;
  user.fb.name.first = fbUser.first_name;
  // etc. more assigning...
}
```

As this is a common recipe, I plan on adding support for this into `everyauth` and `mongoose-auth`, so it's more drop-in, and developers do not have to add this custom code themselves. The intent is for common things like this to be invisible to the developer, so it just *works* *like* *magic*. So, in the near future, you won't have to over-ride the findOrCreateUser step every time you want this feature. This will be coming soon.

## Recipe 2: Configuring Email or Phone to be your Login for the Password Module

By default, `everyauth` and therefore `mongoose-auth` use the attribute `login` as the default attribute used for logging in
with the password module.

However, the need can arise to use a different attribute (such as email) that implies a different schema (use `email: String` instead of `login: String`)
in addition to different validation assumptions (email validations are more strict that login handle validations).

Luckily, `mongoose-auth` provide support for this out of the box. All you need to do is (look for the line labeled "THIS NEXT LINE IS THE ONLY ADDITION"):

```javascript
UserSchema.plugin(mongooseAuth, {
    // Here, we attach your User model to every module
    everymodule: {
      everyauth: {
          User: function () {
            return User;
          }
      }
    }
  , password: {
        // THIS NEXT LINE IS THE ONLY ADDITION
        loginWith: 'email' // Or loginWith: 'phone'

      , everyauth: {
            getLoginPath: '/login'
          , postLoginPath: '/login'
          , loginView: 'login.jade'
          , getRegisterPath: '/register'
          , postRegisterPath: '/register'
          , registerView: 'register.jade'
          , loginSuccessRedirect: '/'
          , registerSuccessRedirect: '/'
        }
    }
});
```

Automatically, `mongoose-auth` will use an `email` String attribute in your User schema
instead of the default `login` String attribute. Moreover, it will automatically add in
validation checks to make sure that the email is valid before registering a user through
the registration process of the password module.

## Recipe 3: Extra password registration data besides login + password

Sometimes your registration will ask for more information from the user besides the login and password.

For this particular scenario, you can configure `extraParams`.

```javascript
UserSchema.plugin(mongooseAuth, {
    // Here, we attach your User model to every module
    everymodule: {
      everyauth: {
          User: function () {
            return User;
          }
      }
    }
  , password: {
        extraParams: {
            phone: String
          , name: {
                first: String
              , last: String
            }
        }

      , everyauth: {
            getLoginPath: '/login'
          , postLoginPath: '/login'
          , loginView: 'login.jade'
          , getRegisterPath: '/register'
          , postRegisterPath: '/register'
          , registerView: 'register.jade'
          , loginSuccessRedirect: '/'
          , registerSuccessRedirect: '/'
        }
    }
});
```

What this effectively does is:

1. Adds `phone`, `name.first`, and `name.last` as attributes to your `UserSchema`.
2. Automatically extracts the registration parameters after a visitor submits the registration
   form and saves them to a new `User` document.
   The registration form `<input>` `name`s should be, e.g., in the example above: 'phone', 
   'name[first]', and 'name[last]'.

Please see [./example/server.js](https://github.com/bnoguchi/mongoose-auth/tree/master/example/server.js#L45)
for a live example.

## Recipe 4: Adding more attributes to your schema

This one ha come up enough that it is here as a recipe, even though it is not specific to `mongoose-auth`. Suppose
you want to add a special attribute such as `roles: [String]` to your UserSchema. This is something that you can do
using just `mongoose`

```javascript
var UserSchema = new mongoose.Schema({
    roles: [String]
  , // other custom attributes
});

UserSchema.plugin(mongooseAuth, {
  // mongooseAuth *adds* other attributes to your UserSchema
  // depending on the auth modules you choose.
});
```

## Recipe 5: Customizing how you do password login authentication

Currently, `mongoose-auth` does password authentication by login and password. Suppose you also want to authenticate
by checking against an additional parameter, like `active`, which is a Boolean attribute on your UserSchema that
indicates whether this user has been activated or not. Then you can modify the `authenticate` everyauth step in the
following way:

```javascript
var UserSchema = new Schema({
  active: Boolean
}), User;
UserSchema.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
          User: function () {
            return User;
          }
      }
    }
  , password: {
        loginWith: 'email' 
      , everyauth: {
            getLoginPath: '/login'
          , postLoginPath: '/login'
          , loginView: 'login.jade'
          , getRegisterPath: '/register'
          , postRegisterPath: '/register'
          , registerView: 'register.jade'
          , loginSuccessRedirect: '/'
          , registerSuccessRedirect: '/'
   
            // WHAT YOU ADD IS THE FOLLOWING:
            // The logic is adapted from the default authenticate
            // implementation in lib/modules/password/everyauth.js
          , authenticate: function (login, password) {
              var promise
                , errors = []; 
              if (!login) errors.push('Missing login.');
              if (!password) errors.push('Missing password.');
              if (errors.length) return errors;

              promise = this.Promise();
              this.User()().authenticate(login, password, function (err, user) {
                if (err) {
                  errors.push(err.message || err);
                  return promise.fulfill(errors);
                }   
                if (!user) {
                  errors.push('Failed login.');
                  return promise.fulfill(errors);
                }
                
                // The following block is the new code
                if (!user.active) {
                  errors.push('You are not yet activated.');
                  return promise.fulfill(errors);
                }
                
                promise.fulfill(user);
              });
              return promise;
            }
        }
    }
});
mongoose.model('User', UserSchema);

User = mongoose.model('User');
```

### License
MIT License

---
### Author
Brian Noguchi
