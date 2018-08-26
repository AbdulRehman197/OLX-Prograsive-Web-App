const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = mongoose.Schema({
    
        adtitle : {
        type: String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    phone : {
        type: Number,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    photo :{
        type: String,
    },
    user :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date : {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product