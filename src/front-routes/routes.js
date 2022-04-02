const express = require('express');
const router = express.Router();

// TEMPLATES REDIRECTS
router.get('/', (req, res) => {
    res.render('index.html');
});
  
router.get('/register', (req, res) => {
    res.render('register.html');
}); 
 
router.get('/text', (req, res) => {
    res.render('text.html');
});

router.get('/insertCategories', (req, res) => {
    res.render('insertCategory.html');
});

router.get('/insertProducts', (req, res) => {
    res.render('insertProducts.html');
});

router.get('/products', (req, res) => {
    res.render('products.html');
});

router.get('/product', (req, res) => {
    res.render('product.html');
});

router.get('/cart', (req, res) => {
    res.render('cart.html');
});

router.get('/login', (req, res) => {
    res.render('login.html');
});
  

module.exports = router;