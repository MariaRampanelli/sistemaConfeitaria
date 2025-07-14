const express = require('express');
const path = require('path');
const router = express.Router();

// Para validar o usuário
const passport = require('passport');

// Funções que permite que apenas usuários admin tenham acesso ao sistema
function apenasAdmin(req, res, next) {
	if (req.user && req.user.permissao === "admin") {
		return next();
	}
	return res.redirect("/cardapio-semanal");
}

function verificaAcessoJWT(req, res, next) {
    passport.authenticate('jwt', {session: false}, (error, user, info) => {
        if (error) {
            return next(error);
        }

        if (!user) {
            return res.redirect('/login');
        }

        req.user = user;
        next();
    })(req, res, next);
}

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/menu-lateral', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'menu-lateral.html'));
});

router.get('/cadastro-usuario', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cadastro_usuario.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/produtos', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'produtos.html'));
});

router.get('/novo-produto', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'produtos-form.html'));
});

router.get('/editar-produto', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-produto.html'));
});

router.get('/cardapio', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cardapio.html'));
});

router.get('/cardapio-semanal', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'cardapio-semanal.html'));
});

router.get('/novo-cardapio', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'cardapio-form.html'));
});

router.get('/editar-cardapio', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-cardapio.html'));
});

router.get('/estoque', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'estoque.html'));
});

router.get('/novo-estoque', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'estoque-form.html'));
});

router.get('/editar-estoque', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-estoque.html'));
});

router.get('/insumos', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'insumos.html'));
});

router.get('/novo-insumo', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'insumos-form.html'));
});

router.get('/editar-insumo', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-insumo.html'));
});

router.get('/vendas', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'vendas.html'));
});

router.get('/nova-venda', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'vendas-form.html'));
});

router.get('/editar-venda', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-venda.html'));
});

router.get('/despesas', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'despesa.html'));
});

router.get('/nova-despesa', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'novo', 'despesa-form.html'));
});

router.get('/editar-despesa', verificaAcessoJWT, apenasAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forms', 'editar', 'editar-despesa.html'));
});

module.exports = router;