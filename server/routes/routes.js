var express = require('express');
//var actions = require('../methods/actions');

var router = express.Router();
//var csrf = require('csurf');
var config = require('../config/database');
var Coin = require('../model/coin');
var Cart = require('../model/cart');
var Round = require('../model/round');
var Order = require('../model/order');
var domain = require('../model/domain');
var Currency = require('../model/currency');
var Fx = require('../model/fxrates');
var stripeAPIKey = require('../model/key');

var domainUrl = new domain;

//var csrfProtection = csrf();
//router.use(csrfProtection);

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
    
router.options('/cart_update', cors(preflightOptions));
router.post('/cart_update', cors(preflightOptions), function(req, res, next) {
    console.log(req.body);
    var cartArray = req.body;

    req.session.cart = null;        //clear the cart in the session

    //if cart is empty
    if(cartArray.length == 0 ) {
        res.json({totalQuantity: 0, totalPrice: 0, items: null});
    }
    else {
        var cart = new Cart(req.session.cart ? req.session.cart: {});   //use empty cart object if cart does not exist
        cartArray.map(element => {
            cart.add(element.item, element.item._id, element.qty)
        });
        
        req.session.cart = cart;        //cart session will be saved automatically when response is sent back
        console.log(req.session.cart);
        
        res.json({totalQuantity: cart.totalQty, totalPrice: cart.totalPrice, items: cart.items});
    }
});

router.options('/get_coin_info', cors(preflightOptions));
router.get('/get_coin_info', cors(preflightOptions), function(req, res, next) {
     Coin.find({}, function(err, coin){
        if(err) {
            throw err;
        }
        if(!coin) {
            res.status(403).json({success: false, msg: 'No coins found'});
        }
        else{
            res.json({success: true, msg: coin});
        }
    });
});

router.options('/add_to_cart/:id', cors(preflightOptions));
router.post('/add_to_cart/:id', cors(preflightOptions), function(req, res, next) {

    var productId = req.params.id;
    var itemQty = Number(req.body.itemQty);
    var cart = new Cart(req.session.cart ? req.session.cart: {});   //use empty cart object if cart does not exist

    Coin.findById(productId, function(err, product) {
        if(err) {
            return res.json({success: false, msg: err});
        }
        cart.add(product, product.id, itemQty);
        req.session.cart = cart;        //cart session will be saved automatically when response is sent back
        console.log(req.session.cart);
        res.json({totalQuantity: cart.totalQty});
    });
});

router.options('/change_currency/:id', cors(preflightOptions));
router.get('/change_currency/:id', cors(preflightOptions), function(req, res, next) {
    var currencySymbol = req.params.id;
    Fx.findOne({currency: currencySymbol}, function(err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            req.session.currency = docs;
            let selectedCurrency = {
                currency: req.session.currency.currency,
                forex: req.session.currency.forex,
                rate: req.session.currency.rate
            }
            res.json({selectedCurrency});
        }
    });
});

router.options('/check_currency/', cors(preflightOptions));
router.get('/check_currency/', cors(preflightOptions), function(req, res, next) {
    if (!req.session.currency) {
        let defaultCurrency = {
            currency: "USD",
            forex: "USD/USD",
            rate: 1      
        };
        res.json({selectedCurrency: defaultCurrency});
    }
    else {
        let selectedCurrency = {
            currency: req.session.currency.currency,
            forex: req.session.currency.forex,
            rate: req.session.currency.rate
        }
        res.json({selectedCurrency});
    }
});

//this route will remove a single item from the shopping cart
router.options('/reduce_one/:id', cors(preflightOptions));
router.get('/reduce_one/:id', cors(preflightOptions), function(req, res, next) {
    var productId = req.params.id
        var cart = new Cart(req.session.cart ? req.session.cart: {});   //use empty cart object if cart does not exist

        cart.reduceByOne(productId);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.json({coins: cart.generateArray(), totalPrice: cart.totalPrice, totalQuantity: cart.totalQty});
});

//this route will remove the entire single item from the shopping cart
router.options('/remove_all/:id', cors(preflightOptions));
router.get('/remove_all/:id', cors(preflightOptions), function(req, res, next) {
    var productId = req.params.id
        var cart = new Cart(req.session.cart ? req.session.cart: {});   //use empty cart object if cart does not exist

        cart.removeAll(productId);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.json({coins: cart.generateArray(), totalPrice: cart.totalPrice, totalQuantity: cart.totalQty});

});

//this route will return the items in the shopping cart to be displayed in the shopping cart order screen
router.options('/shopping_cart', cors(preflightOptions));
router.get('/shopping_cart', cors(preflightOptions), function(req, res, next) {
    if (!req.session.cart) {
        res.json({cart:null});
    }
    else {
        cart = new Cart(req.session.cart);
        res.json({cart});
        //res.json({coins: cart.generateArray(), totalPrice: cart.totalPrice, totalQuantity: cart.totalQty});
    }
});

// This route will only return the number of items in the shopping cart
router.options('/get_total_quantity', cors(preflightOptions));
router.get('/get_total_quantity', cors(preflightOptions), function(req, res, next) {
    if (!req.session.cart) {        //if there is no items in the cart
        res.json({totalQuantity: 0});
    }
    else {
        cart = new Cart(req.session.cart);
        console.log(req.session.cart);
        res.json({totalQuantity: cart.totalQty, totalPrice: cart.totalPrice});   //returns the total quantity in the cart
    }
});

router.options('/checkout', cors(preflightOptions));
router.get('/checkout', cors(preflightOptions), isLoggedIn, function(req, res, next) {
    if (!req.session.cart || req.session.cart.totalQty == 0) {
        res.json({redirect: 'home'});
    }
    else {
        var cart = new Cart(req.session.cart);
        res.json({coins: cart.generateArray(), totalPrice: cart.totalPrice, totalQuantity: cart.totalQty, redirect: false});
    }
});

router.options('/make_charge', cors(preflightOptions));
router.post('/make_charge', cors(preflightOptions), isLoggedIn, function(req, res, next) {
    // Checks if theres a cart session before making a charge
    if(!req.session.cart) {
        res.status(400).json({success: false, msg: 'cart session does not exist'});
    }
    else {
        // Get the payment token submitted by the form:
        var token = req.body.stripeToken; // Using Express
        var currency = {
            currency: req.body.currencySymbol,
            forex: req.body.currencyForex,
            rate: req.body.currencyRate
        }

        var cart = new Cart(req.session.cart);  //access the cart session

        var stripekey = new stripeAPIKey;
        var stripe = require("stripe")(stripekey.getstripeKey);

        //this will get the date from the server and format the date to DD-MMM-YYYY
        var today = new Date();
        var dd = today.getDate();
        var yyyy = today.getFullYear();
        var month = [];
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";

        var mmm = month[today.getMonth()]; //January is 0!

        if(dd<10) {
            dd='0'+dd
        } 

        var todaysDate = dd+'-'+mmm+'-'+yyyy;

        // Charge the user's card:
        var charge = stripe.charges.create({
        amount: cart.totalPrice * 100,  //this amount is in cents
        currency: "usd",
        description: "Example charge",
        source: token,
        }, function(err, charge) {
            if (err) {
                res.status(500).json({success: false, msg: err.message});
            }
            else {
                if (currency.rate !== 1) {
                    cart.totalPrice = 0;
                    Object.keys(cart.items).forEach(function(key) {
                        cart.items[key].item.price = Round(cart.items[key].item.price * currency.rate, 2);
                        cart.items[key].price = Round(cart.items[key].item.price * cart.items[key].qty , 2);
                        cart.totalPrice = Round(cart.totalPrice, 2) + Round(cart.items[key].price, 2);
                    });
                    cart.totalPrice = Round(cart.totalPrice, 2);
                }
                
                console.log(currency);
                var order = new Order({
                    user: req.user,     //from passport.js
                    cart: cart,
                    currency: currency,
                    address: {
                        addressLine1: charge.source.address_line1,
                        addressLine2: charge.source.address_line2,
                        addressCity: charge.source.address_city,
                        addressState: charge.source.address_state,
                        addressZip: charge.source.address_zip,
                        addressCountry: charge.source.address_country
                    },
                    name: charge.source.name,
                    paymentId: charge.id,
                    date: todaysDate
                });

                
                order.save(function(err, result) {
                    if (err) {
                        res.status(500).json({success: false, msg: err.message});
                    }
                    else {
                        console.log('making charge');
                        //console.log(charge);
                        req.session.cart = null;
                        res.json({success: true, orderID: result._id});  
                    }
                })


            }
        });
    }
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    else{
        res.status(403).json({msg: "Forbidden access"});
    }
}

/*
router.post('/authenticate', actions.authenticate);
router.post('/getUserInfo', actions.getUserInfo);
router.put('/modifyUserInfo', actions.modifyUserInfo);
router.get('/getinfo', actions.getinfo);

router.get('/getTodayDate', actions.getTodayDate);
*/

module.exports = router;