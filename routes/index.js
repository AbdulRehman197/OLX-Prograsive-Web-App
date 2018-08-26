var express = require('express');
var router = express.Router();
var multer = require('multer')
var path = require('path');


// Require Product Model

const Product = require('../models/product');
const User = require('../models/user');

// Set Storage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/upload')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
//Filter Image
// const filterFile = (req,file,cb)=>{
// if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
//     cb(null,true)
// }else{
//     cb(null,false)
// }
// }

// Init Upload
const upload = multer({
    storage: storage,
    // filterFile:filterFile
}).single('photo')
// Get Homepage
router.get('/', function (req, res) {
    Product.find({})
        .populate('user')
        .sort({ date: 'desc' })
        .then((product => {
            // console.log(product)
        }))

    res.render('products/index')
});


// Sub Catagrary 

router.get('/catagery', (req, res) => {
    Product.find({})
        .populate('user')
        .sort({ date: 'desc' })
        .then((product) => {
            // console.log(product)
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
// posting the new ad
router.get('/posting', ensureAuthenticated, (req, res) => {
    res.render('products/posting')

})

// prccess ad form
router.post('/catagery', upload, (req, res) => {
    // res.render('products/catagary')
    // console.log(req.file)


    const errors = [];
    if (!req.body.adtitle) {
        errors.push({ text: 'Please enter the Ad Title' })
    }
    if (!req.body.name) {
        errors.push({ text: 'Please enter the Name' })
    } if (!req.body.phone) {
        errors.push({ text: 'Please enter the Phone' })
    }
    if (!req.body.description) {
        errors.push({ text: 'Please enter the Description' })
    }

    if (errors.length > 0) {
        res.render('products/posting', {
            errors,
            adtitle: req.body.adtitle,
            name: req.body.name, phone: req.body.phone,
            description: req.body.description,
            photo: req.file.path,
            catagery: req.body.catagery,
            search: req.body.search,
            user:req.body._id
        })
    } else {
        const newProduct = {
            adtitle: req.body.adtitle,
            name: req.body.name,
            phone: req.body.phone,
            description: req.body.description,
            photo: req.file.path.slice(6),
            catagery: req.body.catagery,
            search: req.body.search,
            user:req.user._id



        }
        new Product(newProduct).save().then((product) => {
            // console.log(product)
            req.flash('success_mgs', 'Your Ad  Adding Succesfuly');
            res.redirect('/catagery')
        })

    }

})
// Product info
router.get('/catagery/:id', (req, res) => {
    Product.findOne({
        _id: req.params.id
    }).then((product) => {
        res.render('products/details', {
            product: product
        })
    })
})

//edit form
router.get('/catagery/edit/:id', ensureAuthenticated, (req, res) => {
    // res.render('products/editad')
    Product.findOne({
        _id: req.params.id
    }).then((product) => {
        // if( product.user != req.user.id){
        //     req.flash('error_mgs','Not Athorized');
        //     res.redirect('/users/login')
        // }
        res.render('products/editad', {
            product: product
        });
    })
})
//edit form  process
router.put('/catagery/:id', upload, ensureAuthenticated, (req, res) => {
    Product.findOne({
        _id: req.params.id
    }).then((product) => {
        product.adtitle = req.body.adtitle,
            product.name = req.body.name,
            product.phone = req.body.phone,
            product.description = req.body.description,
            product.photo = req.file.path,
            product.catagery = req.body.catagery,
            product.save().then((product) => {
                req.flash('success_mgs', 'Your Ad is updated');
                res.redirect('/catagery')
            })
    })

})
// Delete idea prcess
router.delete('/catagery/:id', ensureAuthenticated, (req, res) => {
    Product.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_mgs', 'Videos idea removed');
        res.redirect('/catagery')
    })

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

