// This coin-seeder is not part of the app. It is run separately only to fill in the mongodb data.
// type node coin-seeder.js to execute the file.

var Coin = require('../model/coin');
var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/authng2');        //this is to connect to local mongoDB
mongoose.connect('mongodb://cstoredb:cstoredb@ds227565.mlab.com:27565/cstore');     //this is to connect to remote mongoDB

// creating an array of objects to fill the db
var coins = [
    new Coin({
        title: 'Silver Maple',
        description: 'Canadian silver maple leaf coin',
        year: 2016,
        country: 'Canada',
        material: 'silver',
        finess: '9999',
        weight: '1oz',
        price: 30,
        quantity: 10,
        imagePath: '1.jpg'
    }),
    new Coin({
        title: 'Silver Cougar',
        description: 'Canadian silver cougar coin',
        year: 2012,
        country: 'Canada',
        material: 'silver',
        finess: '9999',
        weight: '1oz',
        price: 35,
        quantity: 20,
        imagePath: '2.jpg'
    }),
    new Coin({
        title: 'Silver Moose',
        description: 'Canadian silver moose coin',
        year: 2012,
        country: 'Canada',
        material: 'silver',
        finess: '9999',
        weight: '1oz',
        price: 40,
        quantity: 15,
        imagePath: '3.jpg'
    }),
    new Coin({
        title: 'Silver Wood Bison',
        description: 'Canadian silver wood bison coin',
        year: 2013,
        country: 'Canada',
        material: 'silver',
        finess: '9999',
        weight: '1oz',
        price: 33,
        quantity: 25,
        imagePath: '4.jpg'
    }),
    new Coin({
        title: 'Silver Wolf',
        description: 'Canadian silver wolf coin',
        year: 2011,
        country: 'Canada',
        material: 'silver',
        finess: '9999',
        weight: '1oz',
        price: 45,
        quantity: 5,
        imagePath: '5.jpg'
    }),
    new Coin({
        title: 'Silver Antelope',
        description: 'Canadian silver antelope coin',
        year: 2013,
        country: 'Canada',
        material: 'silver',
        finess: '9999',
        weight: '1oz',
        price: 37,
        quantity: 5,
        imagePath: '6.jpg'
    }),
    new Coin({
        title: 'Silver Horned Owl',
        description: 'Canadian silver horned owl coin',
        year: 2015,
        country: 'Canada',
        material: 'silver',
        finess: '9999',
        weight: '1oz',
        price: 42,
        quantity: 5,
        imagePath: '7.jpg'
    })
];

var done=0;

// loop through the products array to save each product into mongodb.
// the save() function is asynchronous so theres a callback function to disconnect mongodb once products is saved into mongodb
for(var i = 0; i<coins.length; i++) {
    coins[i].save(function(err, result){
        done++;
        if (done===coins.length){
            exit();
        }
    });
}

function exit(){
    mongoose.disconnect();
}