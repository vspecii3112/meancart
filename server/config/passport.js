/*
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../model/user');
var config = require('../config/database');

module.exports = function(passport) {
     var  opts = {};
    opts.secretOrKey =  config.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    passport.use(new JwtStrategy(opts, function(jwt_payload, done){
        User.find({id: jwt_payload.id}, function(err, user){
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    }));
}
*/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user');

module.exports = function(passport) {
//tells passport how to store the user in the session, which is by user ID.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

//retrieves the user using the stored user ID in the session
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

//passport will create a new user using the local.signup
passport.use('localSignup', new LocalStrategy({
    usernameField: 'uname',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done){
    User.findOne({uname: username}, function(err, user){
        if (err) {  //if theres an error
            return done(err);
        }
        else if (user) { //if a user already exist
            return done(null, false);
        }
        else {  //adding new user
            var newUser = new User();
            newUser.fname = req.body.fname;
            newUser.lname = req.body.lname;
            newUser.email = req.body.email;
            newUser.uname = username;
            newUser.password = newUser.encryptPassword(password);   //encrypting password
            console.log(newUser);
            newUser.save(function(err, result) {
                if (err) {  //if theres an error
                    //console.log(err);
                    return done(err);
                }
                else {  //user is added
                    return done(null, newUser);
                }
            });
        }
    });
}));

passport.use('localSignin', new LocalStrategy({
    usernameField: 'uname',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, username, password, done) {
    User.findOne({uname: username}, function(err, user){
        if (err) {  //if theres an error
            return done(err);
        }
        else if (!user) { //No user found
            return done(null, false);
        }
        else if (!user.validPassword(password)) { //Incorrect password
            return done(null, false);
        }
        else {
            return done(null, user);    //success
        }
    });
}));

};