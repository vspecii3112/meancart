// This coin-seeder is not part of the app. It is run separately only to fill in the mongodb data.
// type node coin-seeder.js to execute the file.

var Fx = require('../model/fxrates');
var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/authng2');        //this is to connect to local mongoDB
mongoose.connect('mongodb://cstoredb:cstoredb@ds227565.mlab.com:27565/cstore');     //this is to connect to remote mongoDB

// creating an array of objects to fill the db
var forex = [
    {
        currency: "CAD",
        forex: "USD/CAD",
        rate: null
    },
    {
        currency: "USD",
        forex: "USD/USD",
        rate: 1
    },
    {
        currency: "XAG",
        forex: "USD/XAG",
        rate: null
    }
];

// loop through the products array to save each product into mongodb.
// the save() function is asynchronous so theres a callback function to disconnect mongodb once products is saved into mongodb

Fx.insertMany(forex, function(err, docs) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(docs);
        mongoose.disconnect();
    }
});
