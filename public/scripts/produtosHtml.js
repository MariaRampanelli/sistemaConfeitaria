axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

document.addEventListener("DOMContentLoaded", () => {
    tabelaProdutos();
});

function tabelaProdutos() {
    axios.get('/api/produtos')
    .then((response) => {
        processaResultadoProduto(response.data);
    }).catch((error) => {
        console.log('Erro ao carregar dados: ', error);
    });
}

function processaResultadoProduto(rows) {
    const tabelaProdutos = document.getElementById('tabelaProdutos');
    tabelaProdutos.innerHTML = '';

    let tabelaResultado = `
    <table class="table table-striped table-bordered table-hover">
        <thead>
            <tr>
                <th scope="col" class="coluna-tabela">Nome</th>
                <th scope="col" class="coluna-tabela">Descrição</th>
                <th scope="col" class="coluna-tabela">Valor</th>
                <th scope="col" class="coluna-tabela">Quantidade</th>
                <th scope="col" class="coluna-tabela">Data de validade</th>
            </tr>
        </thead>
        <tbody scope="row">`;

    for (let i = 0; i < rows.length; i++) {
        tabelaResultado += `<tr> <td class="linha-tabela">${rows[i].nome}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].descr}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].valor}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].quant_produzida}</td>`;
        tabelaResultado += `<td class="linha-tabela">${formataData(rows[i].data_validade)}</td>`;
        tabelaResultado += `<td>
                                <div class="is-flex is-gap-3">
                                    <a href="#" class="btn btn-info btn-table" onclick="openForm('editar-produto')">Editar</a>
                                    <a href="#" class="btn btn-danger btn-table">Deletar</a>
                                </div>
                            </td> </tr>`;                  
    }

    tabelaProdutos.innerHTML = tabelaResultado;
}
