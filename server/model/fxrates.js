var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fxratesSchema = new Schema({
    currency: {
        type: String,
        required: true,
        unique: true
    },
    forex: {
        type: String,
        required: true,
        unique: true
    },
    rate: {
        type: Number
    }                            
});

module.exports = mongoose.model('Fxrates', fxratesSchema);