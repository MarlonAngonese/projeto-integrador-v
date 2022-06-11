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

// ----ADMIN ROUTES

router.get('/admin', (req, res) => {
    res.render('test.html')
});

// GET CATEGORY
router.get('/admin/categories/list', async (req, res) => {
    let all_categories = await Categories.find();

    return res.render('admin/categories/list.categories.html', { categories: all_categories });
});

// GET CATEGORY ADD
router.get('/admin/categories/add', (req, res) => {
    res.render('admin/categories/add.category.html');
});

// GET CATEGORY EDIT
router.get('/admin/categories/edit/:id', async (req, res) => {
    let category = await Categories.findOne({_id: req.params.id});

    console.log(category)

    res.render('admin/categories/edit.category.html', {category: category})
})

// GET PRODUCT LIST
router.get('/admin/products/list', async (req, res) => {
    let all_products = await Products.aggregate([{
        $lookup: {
            from: "categories", // collection name in db
            localField: "category",
            foreignField: "_id",
            as: "categories"
        }
    }]);

    res.render('admin/products/list.products.html', { products: all_products });
});

// GET PRODUCT ADD
router.get('/admin/products/add', (req, res) => {
    Products.find((err, products) => {
        Categories.find().sort('name').exec((err, categories) => {
            res.render('admin/products/add.product.html', { products: products, categories: categories });
        });
    });
});

// GET PRODUCT EDIT
router.get('/admin/products/edit/:id', async (req, res) => {
    let product = await Products.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categories"
            },
        },
        { $match: { "_id": mongoose.Types.ObjectId(req.params.id) } }
    ]);

    let all_categories = await Categories.find();

    res.render('admin/products/edit.product.html', {product: product[0], categories: all_categories});
});

router.get('/admin/contacts/answer', (req, res) => {
    res.render('admin/contacts/answer.contact.html');
});

router.get('/admin/contacts/list', async(req, res) => {
    let all_contacts = await Contacts.find()

    res.render('admin/contacts/list.contacts.html', {'contacts': all_contacts});
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
// router.get('/admin/search', (req, res) => {
//     const query = req.query.q;
//     let cond = [];
//     let queryObj = {};

//     if (query && query.length > 0) {
//         queryObj = { "name": { "$regex": query, "$options": "i" } };
//     }
//     Products.find(queryObj).sort([cond]).exec((err, products) => {
//         res.render('products/list.products.html', { products: products, q: query });
//     });
// });


// ----DEFAULT ROUTES
router.get('/', (req, res) => {
    res.redirect('/home');
});

router.get('/home', (req, res) => {
    res.render('default/home.html');
});

router.get('/register', (req, res) => {
    res.render('default/clients/register.html');
});

router.get('/contact', (req, res) => {
    res.render('default/clients/contact.html');
});

router.get('/cart', (req, res) => {
    res.render('default/orders/cart.html');
});

router.get('/checkout', (req, res) => {
    res.render('default/orders/checkout.html', { client: req.session.client[0] });
});

router.get('/login', (req, res) => {
    res.render('default/clients/login.html');
});

router.get('/confirmation', (req, res) => {
    res.render('default/orders/confirmation.html');
});

router.get('/product/:id', (req, res) => {
    Products.find({ "_id": req.params.id }, (err, obj) => {
        if (err) {
            // podemos botar uma pagína de 404 aqui
        } else {
            const product = obj[0];
            res.render('default/products/view.product.html', { product: product });
        }
    });
});

router.get('/products', (req, res) => {
    Products.find((err, obj) => {
        res.render('default/products/list.products.html', { products: obj });
    });
});

// ----APIS ROUTES
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