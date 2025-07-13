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

// ----- Requisições para Vendas -----
app.get('/api/vendas', async (req, res) => {
  try {
    const vendas = await db.any("SELECT * FROM venda;");
    res.json(vendas).status(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

app.get('/api/venda', async (req, res) => {
  try {
    const id = req.query.id;
    
    const venda = await db.one("SELECT * FROM venda WHERE id = $1;", [id]);
    res.json(venda).status(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

app.delete('/api/venda', async (req, res) => {
  try {
    const id = req.query.id;

    await db.none("DELETE FROM venda WHERE id = $1;", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/verifica-cardapio", async (req, res) => {
    const { produtos } = req.body;

    try {
        const hoje = new Date().toISOString().split("T")[0];

        const resultados = [];

        for (const p of produtos) {
            const resultado = await db.oneOrNone(
                `SELECT 1 FROM produto_cardapio 
                 WHERE nome_produto = $1 AND descr_produto = $2 
                 AND $3 BETWEEN data_ini AND data_fin`,
                [p.nome, p.descr, hoje]
            );

            resultados.push({
                ...p,
                tipo: resultado ? "Cardápio" : "Encomenda"
            });
        }

        res.json(resultados);
    } catch (error) {
        console.error("Erro ao verificar cardápio:", error);
        res.status(500).json({ error: "Erro ao verificar cardápio" });
    }
});



// ----- Requisições para Insumos -----
app.get("/api/insumos", async (req, res) => {
  try {
    const produtos = await db.any("SELECT * FROM insumo;");
    console.log("Insumos retornados");
    res.json(produtos).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.get("/api/insumo", async (req, res) => {
  try {
    const nomeInsumo = req.query.nome;
    const insumo = await db.one("SELECT * FROM insumo WHERE nome = $1;",
      [nomeInsumo]
    );
    res.json(insumo).status(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.post("/api/insumo", async (req, res) => {
  try {
    const nome = req.body.nome;
    const valor = req.body.valor;
    const quant = req.body.quant;
    const dataCompra = req.body.dataCompra;

    const novoInsumo = await db.one(
      "INSERT INTO insumo(nome,valor,quant,data_compra) VALUES ($1, $2, $3, $4) RETURNING *;",
      [nome, valor, quant, dataCompra]
    );

    console.log(`Produto ${novoInsumo.nome} criado!`);
    res.sendStatus(200).json(novoInsumo);
  } catch(error) {
    console.log(error);
    res.sendStatus(400).json({error: error.message});
  }
});

app.put("/api/insumo", async (req, res) => {
  try {
    const nome = req.body.nome;
    const valor = req.body.valor;
    const quant = req.body.quant;
    const data_compra = req.body.data_compra;

    await db.none("UPDATE insumo SET nome = $1, valor = $2, quant = $3, data_compra = $4 WHERE nome = $1;",
      [nome, valor, quant, data_compra]
    );

    console.log("Insumo alterado com sucesso");
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400).json({error: error.message});
  }
});

app.delete("/api/insumo", async (req, res) => {
  try {
    const nome = req.query.nome;
  
    await db.none("DELETE FROM insumo WHERE nome = $1;", nome);
    console.log("Insumo removido");
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(400).json({error: error.message});
  }
});

//---- REQUISIÇÕES ENTRADA E SAÍDA -----

app.get("/api/saida", async (req, res) => {
  try {
    const result = await db.one("SELECT SUM(valor) AS saida FROM despesa;");
    res.json({ saida: result.saida }).status(200);
  } catch (error) {
    console.error("Erro ao buscar saída:", error);
    res.sendStatus(400);
  }
});

app.get("/api/entrada", async (req, res) => {
  try {
    const result = await db.one(`
      SELECT SUM(p.valor) AS entrada
      FROM venda_produto vp
      JOIN produto p ON p.nome = vp.nome_produto AND p.descr = vp.descr_produto;
    `);
    res.json({ entrada: result.entrada }).status(200);
  } catch (error) {
    console.error("Erro ao buscar entrada:", error);
    res.sendStatus(400);
  }
});

