var express = require('express');
var passport = require('passport');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
//var csrf = require('csurf');
var config = require('../config/database');
var User = require('../model/user');
var Order = require('../model/order');
var Cart = require('../model/cart');
var domain = require('../model/domain');
var sendgridAPIKey = require('../model/key');

var domainUrl = new domain;

let preflightOptions = { 
    origin: domainUrl.url,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-XSRF-TOKEN', 'Accept', 'Authorization', 'Set-Cookie'],
    exposedHeaders: ['Content-Type', 'X-XSRF-TOKEN'],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200
};

let corsOptions = { 
    origin: domainUrl.url,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-XSRF-TOKEN', 'Accept', 'Set-Cookie'],
    exposedHeaders: ['Content-Type', 'X-XSRF-TOKEN'],
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200
};

router.options('/adduser', cors(preflightOptions));
router.post('/adduser', cors(preflightOptions), isNotLoggedIn, function(req, res, next) {
    passport.authenticate('localSignup', function(err, user, info) {
        if (err) {
            res.status(500).json({msg: "Internal server error"});
        }

        if(!user) {
            res.status(409).json({success:false, msg: 'User already exist'});
        }
        else {
            req.logIn(user, function(err) {
                if (err) {
                    res.status(500).json({msg: "Internal server error"});
                }
                else {
                    res.json({authenticated: req.isAuthenticated()});
                }
            });
        }
    })(req, res, next);
});

router.options('/authenticate', cors(preflightOptions));
router.post('/authenticate', cors(preflightOptions), isNotLoggedIn, function(req, res, next) {
    passport.authenticate('localSignin', function(err, user, info) {
        if (err) {
            res.status(500).json({msg: "Internal server error"});
        }

        if(!user) {
            return res.status(401).json({msg: 'Incorrect login'});
        }
        else {
            req.logIn(user, function(err) {
                if (err) {
                    res.status(500).json({msg: "Internal server error"});
                }
                else {
                    return res.json({authenticated: req.isAuthenticated()});
                }
            });
        }
    })(req, res, next);
});

router.options('/purchase_history', cors(preflightOptions));
router.get('/purchase_history', cors(preflightOptions), isLoggedIn, function(req, res, next) {
    //req.user(from passport) contains the user ID which is needed for MongoDB to find the correct user
    Order.find({user: req.user}, function(err, orders){
        if (err) {
            res.status(500).json({msg: "Internal server error"});
        }
        else {
            res.json({customerOrders: orders});
        }
    });
});

router.options('/order_details/:id', cors(preflightOptions));
router.get('/order_details/:id', cors(preflightOptions), isLoggedIn, function(req, res, next) {
    let orderID = req.params.id;
    Order.findById(orderID, function(err, orders){
        if (err) {
            res.status(404).json({msg: "Incorrect Order ID"});
        }
        else {
            var cart = new Cart(orders.cart);
            orders.cart.items = cart.generateArray();     //puts the cart items into an array
            res.json({orderDetails: orders});
        }
    });

});

router.options('/isauthenticated', cors(preflightOptions));
router.get('/isauthenticated', cors(preflightOptions), function(req, res, next) {
    res.json({authenticated: req.isAuthenticated()});
});

router.options('/logout', cors(preflightOptions));
router.get('/logout', cors(preflightOptions), isLoggedIn, function(req, res, next) {
    req.logout();       //from passportjs
    res.json({authenticated: req.isAuthenticated()});
});

router.post('/change_password',cors(preflightOptions), isLoggedIn, function(req, res, next){
    User.findOne({uname: req.user.uname}, function(err, user) {
        if(err) {
            //if theres error it does something
        }
        else {
            //if password entered by user is correct, it will update the password with the new password user entered
            if(user.validPassword(req.body.currentPassword)) {
                //encrypting new password
                user.password = user.encryptPassword(req.body.newPassword);
                req.user.password = user.password;
                //saving encrypted new password
                user.save(function (err, updatedUser) {
                    if (err) {
                        return handleError(err);
                    }
                    else {
                        console.log(req.user);
                        res.json({user: updatedUser});
                    }
                });
            }
            else {
                //if password is incorrect, it will send an error
                res.status(401).json({msg: 'Incorrect password'});
            }
        }
    });
});

router.post('/forgot_password', cors(preflightOptions), isNotLoggedIn, function(req, res, next) {
    crypto.randomBytes(20, function(err, buf) {
        if (err) {
            //does something
        }
        else {
            let token = buf.toString('hex');
            User.findOne({email: req.body.email}, function(err, user) {
                if (err) {
                    //does something
                }
                else {
                    if (!user) {
                        res.status(400).json({msg: "Cannot find the email address that was provided"});
                    }
                    else {
                        user.resetPwToken = token;
                        user.resetPwExpires = Date.now() + 3600000;
                        user.save(function(err, updatedUser) {
                            if (err) {
                                //does something
                            }
                            else {
                                var sendgridkey = new sendgridAPIKey;
                                var options = {
                                    auth: {
                                        api_key: sendgridkey.getsendgridKey
                                    }
                                }
                                var mailer = nodemailer.createTransport(sgTransport(options));
                                var email = {
                                    to: user.email,
                                    from: 'reset.password@meancart.com',
                                    subject: 'Forgot Password',
                                    text: 'Please click on this link ' + req.headers.origin + '/reset/' + token + ' to reset your password.'
                                };
                                 
                                mailer.sendMail(email, function(err, res) {
                                    if (err) { 
                                        console.log(err) 
                                    }
                                    console.log(res);
                                });
                                res.json({msg: "Reset password token created", user: updatedUser});
                            }
                        });
                    }
                }
            });
        }
    });
});

router.options('/check_token/:token', cors(preflightOptions));
router.get('/check_token/:token',  cors(preflightOptions), isNotLoggedIn, function(req, res, next) {
    User.findOne({resetPwToken: req.params.token, resetPwExpires: {$gt: Date.now()}}, function(err, user){
        if (err) {
            //does something
        }
        else {
            if (!user) {
                res.status(401).json({msg: "Password reset has expired or invalid URL"})
            }
            else {
                res.json({tokenValid: true})
            }
        }
    });
});

router.post('/reset_password/:token', cors(preflightOptions), isNotLoggedIn, function(req, res, next) {
    User.findOne({resetPwToken: req.params.token, resetPwExpires: {$gt: Date.now()}}, function(err, user){
        if (err) {
            //does something
        }
        else {
            if (!user) {
                res.status(401).json({msg: "Password reset has expired or link provided is invalid"})
            }
            else {
                user.resetPwToken = null;
                user.resetPwExpires = null;
                user.password = user.encryptPassword(req.body.newPassword);
                user.save(function(err, updatedUser){
                    if (err) {
                        //do something
                    }
                    else {
                        res.json({msg: "Password has been successfully updated"})
                    }
                });
            }
        }
    });
});

//this middleware function will prevent access if user is not logged in.
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {         //from passportjs. checks if user is logged in. Returns a boolean.
        return next();
    }
    else{
        res.status(401).json({msg: "Unauthorized access"});
    }
}

//this middleware function will prevent access if user is logged in
function isNotLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {         //from passportjs. checks if user is logged in. Returns a boolean.
        return next();
    }
    else{
        res.status(403).json({msg: "Forbidden access"});
    }
}

module.exports = router;