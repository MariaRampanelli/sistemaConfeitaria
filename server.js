const express = require('express');
const path = require('path');

const app = express();
// Permite usar json nas requisições
app.use(express.json());

const pgp = require("pg-promise")({});
const usuario = "postgres";
const senha = "postgres";
const db = pgp(`postgres://${usuario}:${senha}@localhost:5432/postgres`);

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const requireJWTAuth = passport.authenticate("jwt", { session: false });

// Para pegar os dados do formulário
app.use(express.urlencoded({ extended: true }));

// Servir scripts e assets estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});

// Sessão e Autenticação
app.use(
	session({
		secret: 'frase_secreta_para_sistema_de_confeitaria_SECRET',
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	}),
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "useremail",
      passwordField: "password",
    },
    async (useremail, password, done) => {
      try {
        const user = await db.oneOrNone(
          "SELECT * FROM usuario WHERE email = $1;",
          [useremail]
        );

        if (user) {
          // Usuário admin encontrado no banco
          const passwordMatch = await bcrypt.compare(password, user.senha);
          if (passwordMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Senha incorreta." });
          }
        } else {
          // Usuário não está no banco (não admin)
          // Aceita login para qualquer usuário "visitante"
          const guestUser = {
            ID_usuario: null,
            email: useremail,
            permissao: "guest",
          };
          return done(null, guestUser);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estratégia JWT
passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: "your-secret-key",
		},
		async (payload, done) => {
			try {
				const user = await db.oneOrNone(
					"SELECT * FROM usuario WHERE email = $1;",
					[payload.useremail]
				);

				if (user) {
					done(null, user);
				} else {
					done(null, false);
				}
			} catch (error) {
				done(error, false);
			}
		}
	)
);

passport.serializeUser((user, cb) => {
	process.nextTick(() => {
		return cb(null, {
			id: user.ID_usuario,
			username: user.email,
		});
	});
});

passport.deserializeUser((user, cb) => {
	process.nextTick(() => {
		return cb(null, user);
	});
});

// Rota de login
app.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        useremail: user.email,
        permissao: user.permissao,
      },
      "your-secret-key",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, permissao: user.permissao });
  }
);

app.post("/logout", (req, res, next) => {
	req.logout((err) => {
		if (err) return next(err);
		res.redirect("/");
	});
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

app.get("/api/produtos", async (req, res) => {
  try {
    if (req.query.nome && req.query.descr) {
      // Busca específica
      const produto = await db.one(
        "SELECT * FROM produto WHERE nome = $1 AND descr = $2;",
        [req.query.nome, req.query.descr]
      );
      res.status(200).json(produto);
    } else {
      // Lista todos
      const produtos = await db.any("SELECT * FROM produto;");
      res.status(200).json(produtos);
    }
  } catch (error) {
    console.error(error);
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
    const vendas = await db.any(`
      SELECT v.id_venda, v.nome_cliente, v.forma_pagamento, v.tipo_entrega, v.tipo_venda, v.data_entrega,
             p.nome AS nome_produto, p.descr AS descr_produto, p.valor
      FROM venda v
      JOIN venda_produto vp ON v.id_venda = vp.id_venda
      JOIN produto p ON vp.nome_produto = p.nome AND vp.descr_produto = p.descr
    `);
    res.status(200).json(vendas);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
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

    await db.none("DELETE FROM venda_produto WHERE id_venda = $1;", [id]);
    await db.none("DELETE FROM venda WHERE id_venda = $1;", [id]);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/vendas', async (req, res) => {
  const {
    nome_cliente,
    forma_pagamento,
    tipo_entrega,
    tipo_venda,
    data_entrega,
    produtos
  } = req.body;

  try {
    // Insere venda e obtém ID gerado
    const venda = await db.one(
      `INSERT INTO venda (nome_cliente, forma_pagamento, tipo_entrega, tipo_venda, data_entrega)
       VALUES ($1, $2, $3, $4, $5) RETURNING id_venda`,
      [nome_cliente, forma_pagamento, tipo_entrega, tipo_venda, data_entrega]
    );

    console.log('Venda retornada:', venda);

    const ID_venda = venda.id_venda;

    // Monta os valores para venda_produto
    const queries = produtos.map((p) => {
      return db.none(
        `INSERT INTO venda_produto (ID_venda, nome_produto, descr_produto)
         VALUES ($1, $2, $3)`,
        [ID_venda, p.nome, p.descr]
      );
    });

    await Promise.all(queries);

    res.status(201).json({ mensagem: 'Venda cadastrada com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar venda:', error.message);
    res.status(500).json({ erro: error.message });
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

// Requisições para Despesas
app.get("/api/despesas", async (req, res) => {
  try {
    const produtos = await db.any("SELECT * FROM despesa;");
    console.log("Despesas retornados");
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

// Para ter acesso as rotas
const indexRouter = require('./rotas/rotas.js');
app.use('/', indexRouter);