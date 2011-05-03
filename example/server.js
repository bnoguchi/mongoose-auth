var express = require('express');

var conf = require('./conf');

var everyauth = require('everyauth')
  , Promise = everyauth.Promise;

everyauth.debug = true;

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = mongoose.SchemaTypes.ObjectId;

var UserSchema = new Schema({})
  , User;

var mongooseAuth = require('../index');

UserSchema.plugin(mongooseAuth, {
    everymodule: {
      everyauth: {
          User: function () {
            return User;
          }
      }
    }
  , facebook: {
      everyauth: {
          myHostname: 'http://local.host:3000'
        , appId: conf.fb.appId
        , appSecret: conf.fb.appSecret
        , redirectPath: '/'
      }
    }
  , twitter: {
      everyauth: {
          myHostname: 'http://local.host:3000'
        , consumerKey: conf.twit.consumerKey
        , consumerSecret: conf.twit.consumerSecret
        , redirectPath: '/'
      }
    }
  , password: {
        loginWith: 'email'
      , extraParams: {
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
  , github: {
      everyauth: {
          myHostname: 'http://local.host:3000'
        , appId: conf.github.appId
        , appSecret: conf.github.appSecret
        , redirectPath: '/'
      }
    }
  , instagram: {
      everyauth: {
          myHostname: 'http://local.host:3000'
        , appId: conf.instagram.clientId
        , appSecret: conf.instagram.clientSecret
        , redirectPath: '/'
      }
    }
});
// Adds login: String

mongoose.model('User', UserSchema);

mongoose.connect('mongodb://localhost/example');

User = mongoose.model('User');

var app = express.createServer(
    express.bodyParser()
  , express.static(__dirname + "/public")
  , express.cookieParser()
  , express.session({ secret: 'esoognom'})
  , mongooseAuth.middleware()
);

app.configure( function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

mongooseAuth.helpExpress(app);

app.listen(3000);
