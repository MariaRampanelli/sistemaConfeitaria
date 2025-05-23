const express = require('express');
const path = require('path');
const router = express.Router();

//Rota principal views/index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

router.get('/header', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'header.html'));
})

router.get('/footer', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'footer.html'));
})

router.get('/menu-lateral', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'menu-lateral.html'));
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'produtos.html'));
})

module.exports = router;