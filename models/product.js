const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    date: {
        type: Date,
        default:  Date.now
    }

})

module.exports = mongoose.model('Product', productSchema);