var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        type: Object,
        required: true
    },
    currency: {
        type: Object,
        required: true
    },
    address: {
        type: Object,
        required: true
    },   
    name: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }                          
});

module.exports = mongoose.model('Order', orderSchema);