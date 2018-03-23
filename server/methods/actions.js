var User = require('../model/user');
var Coin = require('../model/coin');
var config = require('../config/database');
var jwt = require('jwt-simple');

var functions = {
    // This authenticate function will find the user info in the MongoDB using the name and returns it in the 'user' object
    authenticate: function(req, res) {
        User.findOne({
            uname: req.body.uname
        }, function(err, user){
            if (err) {
                throw err;
            }
            
            if(!user) {
                res.status(403).send({success: false, msg: 'Authentication failed, User not found'});
            }
            
           else {
                user.comparePassword(req.body.password, function(err, isMatch){
                    if(isMatch && !err) {
                        var token = jwt.encode(user, config.secret);
                        res.json({success: true, token: token});
                    } else {
                        return res.status(403).send({success: false, msg: 'Authenticaton failed, wrong password.'});
                    }
                })
            }
            
        })
    },
    addNew: function(req, res){
        if((!req.body.fname)||(!req.body.lname)||(!req.body.email)||(!req.body.uname) || (!req.body.password)){
            console.log(req.body.fname);
            console.log(req.body.lname);
            console.log(req.body.email);
            console.log(req.body.uname);
            console.log(req.body.password);
            
            res.json({success: false, msg: 'Enter all values'});
        }
        else {
            var newUser = User({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                uname: req.body.uname,
                password: req.body.password
            });
            
            newUser.save(function(err, newUser){
                if (err){
                    // MongoDB will return error code 11000 if there is a duplicate username since username is made unique in schema
                    if (err.code == 11000) {
                        res.status(400).send({success:false, msg: 'Duplicate Username'})
                    }
                    else
                        res.status(503).send({success:false, msg: 'MongoDB Unavailable'})
                }
                
                else {
                    res.json({success:true, msg:'Successfully saved'});
                }
            })
        }
    },

    // This getinfo function will decode the JWT and return the username identity
    getinfo: function(req, res){
        //This will decode the token 'Bearer' + jwt
        if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1];
            var decodedtoken = jwt.decode(token, config.secret);
            return res.json({success: true, username: decodedtoken.uname});   // returns the username as a json object in the response
        }
        else {
            return res.status(403).send({success:false, msg: 'Invalid header'});
        }
    },

    getUserInfo: function(req, res){
        User.findOne({
            uname: req.body.uname
        }, function(err, user){
            if (err) {
                throw err;
            }
            
            if(!user) {
                res.status(403).send({success: false, msg: 'User not found'});
            }
            
           else {
                return res.json({success: true, firstName: user.fname, lastName: user.lname, userEmail: user.email});
            }
            
        })
    },
    
    modifyUserInfo: function(req, res) {

        User.findOneAndUpdate(
            {uname: req.body.uname},
            {fname: req.body.fname, lname: req.body.lname, email: req.body.email},
            {new:true},
            function(err, user){
                if(err) {
                    throw err;
                }
                if(!user) {
                    res.status(403).send({success: false, msg: 'User not found'});
                }
                else{
                    res.json({success: true, msg: 'Update user complete'});
                }
            })

    },

    getCoinInfo: function(req, res) {

        Coin.find({}, function(err, coin){
                if(err) {
                    throw err;
                }
                if(!coin) {
                    res.status(403).send({success: false, msg: 'No coins found'});
                }
                else{
                    res.json({success: true, msg: coin});
                }
            })

    },

    getTodayDate: function(req, res) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        
        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

        today = yyyy+'-'+mm+'-'+dd;
        res.json({success: true, msg: today});
    }
    
}

module.exports = functions;
