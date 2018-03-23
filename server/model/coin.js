var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var coinSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },   
    country: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true
    },
    finess: {
        type: String,
        required: true
    },
    weight: {
    type: String,
    required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required:true
    },
    imagePath: {
        type: String,
        required: true
    }                               
});

module.exports = mongoose.model('Coin', coinSchema);