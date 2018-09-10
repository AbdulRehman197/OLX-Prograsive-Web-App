const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema({

    productId: {
        type: String,
        required: true
    },
    message:{
        type:String,
    },
    username:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    date: {
        type: Date,
        default:  Date.now
    }

})

module.exports = mongoose.model('Message', messageSchema);