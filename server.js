const express = require('express');
const path = require('path');

const app = express();
// Permite usar json nas requisições
app.use(express.json());

const pgp = require("pg-promise")({});
const usuario = "postgres";
const senha = "postgres";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/postgres`);

// Para pegar os dados do formulário
app.use(express.urlencoded({ extended: true }));

// Servir scripts e assets estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));

// Para ter acesso as rotas
const indexRouter = require('./rotas/rotas.js');
app.use('/', indexRouter);

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

// ----- Requisições para Produtos -----
app.get("/api/produtos", async (req, res) => {
  try {
    const produtos = await db.any("SELECT * FROM produto;");
    console.log("Produtos retornados");
    res.json(produtos).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.get("/api/produto", async (req, res) => {
  try {
    const produtoNome = (req.query.nome);
    const produtoDescr = (req.query.descr);
    const produto = await db.one("SELECT * FROM produto WHERE nome = $1 AND descr = $2;",
      [produtoNome, produtoDescr]
    );
    res.json(produto).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

