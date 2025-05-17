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
    res.sendFile(path.join(__dirname, '..', 'views', 'footer.html'))
})

module.exports = router;