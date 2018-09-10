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
    catagery:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    message:{
        type:Schema.Types.ObjectId,
        ref:'Message',
    },
    date: {
        type: Date,
        default:  Date.now
    }

})

module.exports = mongoose.model('Product', productSchema);