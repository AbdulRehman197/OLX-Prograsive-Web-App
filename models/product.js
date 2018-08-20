const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

    adtitle: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: {
        type: String,
    },
    date: {
        type: Date,
        default:  Date.now
    }

})

module.exports = mongoose.model('Product', productSchema);