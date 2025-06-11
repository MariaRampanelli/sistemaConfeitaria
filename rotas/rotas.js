const express = require('express');
const path = require('path');
const router = express.Router();

//Rota principal views/index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

router.get('/menu-lateral', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'menu-lateral.html'));
});

router.get('/cadastro-usuario', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cadastro_usuario.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/produtos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'produtos.html'));
})

router.get('/novo-produto', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'produtos-form.html'));
})

router.get('/editar-produto', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-produto.html'));
})

router.get('/encomendas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'encomendas.html'));
})

router.get('/nova-encomenda', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'encomendas-form.html'));
})

router.get('/editar-encomenda', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-encomenda.html'));
})

router.get('/insumos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'insumos.html'));
})

router.get('/novo-insumo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'insumos-form.html'));
})

router.get('/editar-insumo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-insumo.html'));
})

router.get('/vendas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'vendas.html'));
})

router.get('/nova-venda', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'vendas-form.html'));
})

router.get('/editar-venda', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-venda.html'));
})

module.exports = router;