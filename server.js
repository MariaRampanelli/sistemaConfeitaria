const express = require('express');
const path = require('path');

const app = express();

// Permite usar json nas requisições
app.use(express.json());

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
