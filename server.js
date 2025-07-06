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

app.post("/api/produto", async (req, res) => {
  try {
    const nome = req.body.nome;
    const descr = req.body.descr;
    const data_validade = req.body.data_validade;
    const valor = req.body.valor;
    const quant = req.body.quant;

    const novoProduto = await db.one(
      "INSERT INTO produto(nome,descr,valor,quant_produzida,data_validade) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
      [nome, descr, valor, quant, data_validade]
    );

    console.log(`Produto ${novoProduto.descr} criado!`);
    res.sendStatus(200).json(novoProduto);
  } catch(error) {
    console.log(error);
    res.sendStatus(400).json({error: error.message});
  }
});

app.put("/api/produto", async (req, res) => {
  try {
    const nome = req.body.nome;
    const descr = req.body.descr;
    const data_validade = req.body.data_validade;
    const valor = req.body.valor;
    const quant = req.body.quant;

    await db.none("UPDATE produto SET nome = $1, descr = $2, valor = $3, quant_produzida = $4, data_validade = $5 WHERE nome = $1 AND descr = $2;",
      [nome, descr, valor, quant, data_validade]
    );

    console.log("Produto alterado com sucesso");
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400).json({error: error.message});
  }
});

app.delete("/api/produto", async (req, res) => {
  try {
    const nome = req.query.nome;
    const descr = req.query.descr;

    await db.none("DELETE FROM produto WHERE nome = $1 AND descr = $2;", [nome, descr]);
    console.log("Produto removido");
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400).json({error: error.message});
  }
});
