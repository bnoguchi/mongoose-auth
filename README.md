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

mongoose-auth does 3 things:

1. Schema decoration
2. (optional) Drop in routing and event handling for 
   (connect)[https://github.com/senchalabs/connect] apps.
3. (optional) Dynamic helpers for 
   (express)[https://github.com/visionmedia/express] apps.

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

## Beyond Schema Decoration: Routing and Event Handling

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
