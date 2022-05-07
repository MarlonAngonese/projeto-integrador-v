const express = require('express');
const router = express.Router();

// TEMPLATES REDIRECTS
router.get('/', (req, res) => {
    res.render('index.html');
});
  
router.get('/register', (req, res) => {
    res.render('register.html');
}); 
 
router.get('/contact', (req, res) => {
    res.render('contact.html');
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

router.get('/checkout', (req, res) => {
    console.log(req.session);
    res.render('checkout.html', {client: req.session.client});
});

router.get('/login', (req, res) => {
    res.render('login.html');
});

module.exports = router;