var Coin = require('../model/coin');
var request = require('request');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/authng2');

var silverData;
var silverPrice = 2;

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

// this variable stores the AM fix price of silver by doing a API call **************************
var getURL = 'https://www.quandl.com/api/v3/datasets/LBMA/SILVER.json?api_key=uCeL4QFEzf5PKCoASiym&start_date=' + todaysDate();
// **********************************************************************************************

// This request function makes 
request(getURL, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        silverData = JSON.parse(body);
        silverPrice = silverData.dataset.data[0][1];
        updateCoinPrice(silverPrice);
        console.log(silverPrice);

    }
});

// This function will update the price of the coin in the MongoDB using mongoose update *********
function updateCoinPrice(spotPrice){
    Coin.update({price:{$exists:true}},{$set:{price:spotPrice}},{multi:true}, function (err, raw) {
        if (err)
            return err;
        console.log('The raw response from Mongo was ', raw);
        mongoose.disconnect();
    });
}
// **********************************************************************************************

// This function will return todays date in format yyyy-mm-dd ***********************************
function todaysDate(){
    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    return today = yyyy+'-'+mm+'-'+dd;
}
// **********************************************************************************************