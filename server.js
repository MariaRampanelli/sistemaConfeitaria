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

app.get("/api/entrada", async (req, res) => {
  try {
    const result = await db.one(`
      SELECT COALESCE(SUM(p.valor * p.quant_produzida), 0) AS total_entrada
      FROM venda v
      JOIN venda_produto vp ON v.ID_venda = vp.ID_venda
      JOIN produto p ON vp.nome_produto = p.nome AND vp.descr_produto = p.descr;
    `);
    console.log("Entrada total retornada");
    res.json({ entrada: result.total_entrada });
  } catch (error) {
    console.error("Erro ao calcular entrada:", error);
    res.sendStatus(500);
  }
});

app.get("/api/saida", async (req, res) => {
  try {
    const result = await db.one(`
      SELECT COALESCE(SUM(valor), 0) AS total_saida
      FROM despesa;
    `);
    res.json({ saida: result.total_saida });
  } catch (error) {
    console.error("Erro ao calcular saída:", error);
    res.sendStatus(500);
  }
});
