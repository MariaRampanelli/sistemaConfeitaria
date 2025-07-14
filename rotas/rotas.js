const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

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
});

router.get('/novo-produto', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'produtos-form.html'));
});

router.get('/editar-produto', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-produto.html'));
});

router.get('/cardapio', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cardapio.html'));
});

router.get('/cardapio-semanal', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cardapio-semanal.html'));
});

router.get('/novo-cardapio', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'cardapio-form.html'));
});

router.get('/editar-cardapio', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-cardapio.html'));
});

router.get('/estoque', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'estoque.html'));
});

router.get('/novo-estoque', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'estoque-form.html'));
});

router.get('/editar-estoque', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-estoque.html'));
});

router.get('/insumos', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'insumos.html'));
});

router.get('/novo-insumo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'insumos-form.html'));
});

router.get('/editar-insumo', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-insumo.html'));
});

router.get('/vendas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'vendas.html'));
});

router.get('/nova-venda', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'vendas-form.html'));
});

router.get('/editar-venda', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-venda.html'));
});

router.get('/despesas', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'despesa.html'));
});

router.get('/nova-despesa', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'despesa-form.html'));
});

router.get('/editar-despesa', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-despesa.html'));
});

module.exports = router;