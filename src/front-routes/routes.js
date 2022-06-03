const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

// SCHEMAS
const ClientsSchema = require('../schemas/clients');
const ContactsSchema = require('../schemas/contact');
const CategoriesSchema = require('../schemas/categories');
const ProductsSchema = require('../schemas/products');
const Clients = mongoose.model('clients', ClientsSchema);
const Contacts = mongoose.model('contact', ContactsSchema);
const Categories = mongoose.model('categories', CategoriesSchema);
const Products = mongoose.model('products', ProductsSchema);

// GET CATEGORY
router.get('/admin/categories', (req, res) => {
    Categories.find((err, obj) => {
        res.render('categories/add.category.html', { categories: obj });
    });
});

// GET PRODUCTS
router.get('/admin/insertProducts', (req, res) => {
    Products.find((err, products) => {
        Categories.find().sort('name').exec((err, categories) => {
            res.render('products/add.products.html', { products: products, categories: categories });
        });
    });
});

// router.get('/admin/c/:slug', (req, res) => {
//     Categories.aggregate([
//         { $match: { slug: req.params.slug } },
//         {
//             $lookup: {
//                 from: "products", // collection name in db
//                 localField: "_id",
//                 foreignField: "category",
//                 as: "products"
//             }
//         }]).exec((err, obj) => {
//             console.info(obj);
//             res.render('products/list.products.html', { products: obj[0].products });
//         });
// });

// SEARCH PRODUCTS
router.get('/admin/search', (req, res) => {
    const query = req.query.q;
    let cond = [];
    let queryObj = {};

    if (query && query.length > 0) {
        queryObj = { "name": { "$regex": query, "$options": "i" } };
    }
    Products.find(queryObj).sort([cond]).exec((err, products) => {
        res.render('products/list.products.html', { products: products, q: query });
    });
});

// DEFAULT ROUTES
router.get('/', (req, res) => {
    res.render('index.html');
});

router.get('/register', (req, res) => {
    res.render('clients/register.html');
});

router.get('/contact', (req, res) => {
    res.render('clients/contact.html');
});

router.get('/products', (req, res) => {
    res.render('products/list.products.html');
});

router.get('/product', (req, res) => {
    res.render('products/view.product.html');
});

router.get('/cart', (req, res) => {
    res.render('clients/cart.html');
});

router.get('/checkout', (req, res) => {
    console.log(req.session);
    res.render('clients/checkout.html', { client: req.session.client });
});

router.get('/login', (req, res) => {
    res.render('clients/login.html');
});

router.get('/recover', (req, res) => {
    res.render('clients/recover.html');
});

// router.get('/payment', (req, res) => {
//     res.render('clients/payment.html');
// });

router.get('/confirmation', (req, res) => {
    res.render('clients/confirmation.html');
});

router.get('/product/:id', (req, res) => {
    Products.find({ "_id": req.params.id }, (err, obj) => {
        if (err) {
            // podemos botar uma pagína de 404 aqui
        } else {
            const product = obj[0];
            res.render('products/view.product.html', { product: product });
        }
    });
});

router.get('/products', (req, res) => {
    Products.find((err, obj) => {
        res.render('products/list.products.html', { products: obj });
    });
});

// APIS ROUTES
router.get('/api/product/:id', (req, res) => {
    Products.find({ "_id": req.params.id }, (err, obj) => {
        if (err) {
            res.send(null);
        } else {
            const product = obj[0];
            res.send(product);
        }
    });
});

module.exports = router;