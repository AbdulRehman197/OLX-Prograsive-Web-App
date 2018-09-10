var express = require('express');
var productsRouter = express.Router();
var multer = require('multer')
var path = require('path');

//Load Models
var Product = require('../models/product');
//Multer Storage
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
productsRouter.get('/', function (req, res) {
    res.render('products/index')
});
// Sub Catagrary 
productsRouter.get('/catagery', (req, res) => {
    Product.find({})
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
// posting the new ad
productsRouter.get('/posting', (req, res) => {
    res.render('products/posting')
})
// prccess ad form
productsRouter.post('/api/catagery', upload, (req, res) => {
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
        res.render('products/posting', ensureAuthenticated, {
            errors,
            adtitle: req.body.adtitle,
            name: req.body.name, phone: req.body.phone,
            description: req.body.description,
            photo: req.file.path,
            catagery: req.body.catagery,
            price: req.body.price,
            search: req.body.search,
            user: req.user.id,
            // message:req.message.message
        })
    } else {
        const newProduct = {
            adtitle: req.body.adtitle,
            name: req.body.name,
            phone: req.body.phone,
            description: req.body.description,
            photo: req.file.path.slice(6),
            catagery: req.body.catagery,
            price: req.body.price,
            search: req.body.search,
            user: req.user.id,
            // message:req.message.message
 }
        new Product(newProduct).save().then((product) => {
            // console.log(product)
            req.flash('success_mgs', 'Your Ad  Adding Succesfuly');
            res.redirect('/')
        })
    }
})
//edit form
productsRouter.get('/catagery/edit/:id', (req, res) => {
    Product.findOne({
        _id: req.params.id
    }).then((product) => {
        res.render('products/editad', {
            product: product
        });
    })
})
//edit form  process
productsRouter.put('/catagery/:id', upload, (req, res) => {
    Product.findOne({
        _id: req.params.id
    }).then((product) => {
        product.adtitle = req.body.adtitle,
            product.name = req.body.name,
            product.phone = req.body.phone,
            product.description = req.body.description,
            product.photo = req.file.path,
            product.catagery = req.body.catagery,
            product.price = req.body.price,
            product.save().then((product) => {
                req.flash('success_mgs', 'Your Ad is updated');
                res.redirect('/catagery')
            })
    })

})
// Delete add prcess
productsRouter.delete('/api/catagery/:id', (req, res) => {
    Product.remove({
        _id: req.params.id
    }).then(() => {
        req.flash('success_mgs', 'Ad removed');
        res.redirect('/catagery')
    })

})
// Product info
productsRouter.get('/catagery/:id', (req, res) => {
    if (req.params.id.indexOf('.') != -1) {
        return res.sendfile('../public/upload/' + req.params.id);
    }
    Product.findOne({
        _id: req.params.id
    })
        .populate('user')
        .then((product) => {
            res.render('products/details', {
                product: product
            })
        })
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}
module.exports = productsRouter;