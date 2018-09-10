// import { read } from 'fs';
var express = require('express');
var router = express.Router();
var multer = require('multer')
var path = require('path');
const db = require('dexie');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var FCM = require("fcm-node");
var serverKey =
    "AAAASjP1pJw:APA91bGhQAflwnexy8Qnt9nNhYPHnmBLto8P4kdeSDLpSq1iX2XTwptQ4c3toXY9okKdBk3zLx6S47eA5Wb9M8Jga9immHQUjyo2HZRMuL4aTE1ocUCxs4LdY7EfoNH3OwygXezr5M7bXa5pLLOzrKYw44rasjE66A";

// Require  Models
const Product = require('../models/product');
const User = require('../models/user');
const Message = require('../models/message');

// Set Storage 
//search catagery
router.get('/catagery/search/:catagery', (req, res) => {
    let searchTerm = req.query.searchTerm;
    let words = searchTerm.split(' ');
    let rejex = words.map((word) => new RegExp(word, 'i'))
    Product.find({ catagery: req.params.catagery, adtitle: { $in: rejex } })
        .populate('user')
        .sort({ date: 'desc' })
        .then((product) => {
            const dataArray = [];
            const arraySize = 3
            for (var i = 0; i < product.length; i += arraySize) {
                dataArray.push(product.slice(i, i + arraySize))
            }
            res.render('products/catagary', {
                product: dataArray
            })
        })
})
//search catagery post
router.get('/catagery/browse/:catagery', (req, res) => {
    Product.find({ catagery: req.params.catagery })
        .populate('user')
        .sort({ date: 'desc' })
        .then((product) => {
            const dataArray = [];
            const arraySize = 3
            for (var i = 0; i < product.length; i += arraySize) {
                dataArray.push(product.slice(i, i + arraySize))
            }

            res.render('products/catagary', {
                product: dataArray
            })
        })

})

//send message 
router.post('/api/catagery/message/:id', (req, res) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            var fcm = new FCM(serverKey);
            var message = {
                //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: 'Abdulrehman',
                collapse_key: "your_collapse_key",
                notification: {
                    title: 'Heloo abdulrehman',
                    body: "You Have A New Message"
                },

                data: {
                    //you can send only notification or only data(or include both)
                    my_key: "my value",
                    my_another_key: "my another value"
                }
            };

            fcm.send(message, function (err, response) {
                if (err) {
                    console.log(err);
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
            });

        })

    const newMessage = {
        productId: req.params.id,
        message: req.body.message,
        username: req.body.buyerName,
        user: req.user.id
    }
    new Message(newMessage).save().then((product) => {
        req.flash('success_mgs', 'Your Message  Send Succesfuly');
        res.redirect('/catagery')
    })

})
// Get Buyer Messsge
router.get('/catagery/message', (req, res) => {
    Message.find({})
        .populate('user')
        .then((message) => {
            res.render('products/message', {
                message: message
            })
        })
})
// Delete message prcess
router.delete('/api/catagery/message/:id', (req, res) => {
    Message.findByIdAndRemove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_mgs', 'Ad removed');
        res.redirect('/catagery/message')
    })

})

// Favorite Products
router.get('/catagery/favorite', (req, res) => {
    req.user
        .populate('favorite', (error, user) => {
            const dataArray = [];
            const arraySize = 3
            for (var i = 0; i < user.favorite.length; i += arraySize) {
                dataArray.push(user.favorite.slice(i, i + arraySize))
            }
            // console.log(product)
            res.render('products/favorite', {
                product: dataArray
            })
        })
})
// user.populate('product').exec(function (err, data) {
//     console.log(data);
//})
router.post('/api/catagery/favorite/add/:id', (req, res) => {
    req.user.populate('favoraite', (err, data) => {

        var exists = data.favorite.filter((item) => {
            console.log(item)
            if (item.toHexString() == req.params.id) {
                return true;
            }
        })[0];

        var query = !exists ? { $push: { favorite: req.params.id } } : { $pull: { favorite: { $in: [req.params.id] } } };

        User.findByIdAndUpdate({ _id: req.user._id }, query, function (err, data) {
            res.redirect('/catagery');
        });

    })

});

router.post('/api/catagery/favorite/remove/:id', (req, res) => {
    User.findByIdAndUpdate({ _id: req.user._id }, { $pull: { favorite: { $in: [req.params.id] } } }, function (err, data) {
        req.flash('success_mgs', 'Your Message  Send Succesfuly');
        res.redirect('/catagery/favorite');
    });
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');

    }
}
module.exports = router;

