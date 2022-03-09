const express = require('express');
const router = express.Router();

// TEMPLATES REDIRECTS
app.get('/', (req, res) => {
    res.render('index.html');
});
  
app.get('/form', (req, res) => {
    res.render('form.html');
});

app.get('/text', (req, res) => {
    res.render('text.html');
});

module.exports = router;