// load passport local module
var LocalStrategy = require('passport-local').Stategy;

//load user model
var User = require('../models/User');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.findOne({ 'local,email' : email }, function(err, user) {
      if (err)
        return done(err);
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      if (!user.validPassword(password))
        return done(null,false, req.flash('loginMessage', 'Oops! Wrong password'));
      return done(null, user);
    });
  }));
};