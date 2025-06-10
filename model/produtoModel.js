const pgp = require('pg-promise')({});
const db = pgp('postgres://postgres:postgres@localhost:5432/postgres');

exports.getAll = () => {
  return db.any('SELECT * FROM produtos');
};

// Model traz as informações do banco e Controller faz as requisições HTTP