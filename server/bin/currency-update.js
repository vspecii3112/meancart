#!/usr/bin/env node

var mongoose = require('mongoose');

var Fx = require('../model/fxrates');

var request = require('request');
var apiKey = require('../model/key');
var fxKey = new apiKey;

// this variable stores the AM fix price of silver by doing a API call **************************
var getURL = "https://openexchangerates.org/api/latest.json?app_id=" + fxKey.getopenexchangeratesKey;
// **********************************************************************************************

//mongoose.connect('mongodb://localhost:27017/authng2');        //this is to connect to local mongoDB
mongoose.connect('mongodb://cstoredb:cstoredb@ds227565.mlab.com:27565/cstore');     //this is to connect to remote mongoD

// This request function makes 
request(getURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        let exchangeRates = JSON.parse(body);
        Fx.bulkWrite([
            {
                updateOne: {
                    filter: { currency: "CAD" },
                    update: { $set: { rate: exchangeRates.rates["CAD"] } }
                }
            },
            {
                updateOne: {
                    filter: { currency: "XAG" },
                    update: { $set: { rate: exchangeRates.rates["XAG"] } }
                }
            }
        ]).then(docs => {
            console.log("Update success");
            mongoose.disconnect();
        });
    }
    else {
        console.log(error);
        mongoose.disconnect();
    }
});