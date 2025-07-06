axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

document.addEventListener("DOMContentLoaded", () => {
    tabelaProdutos();
    novoProduto();
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
    if (!tabelaProdutos) {
        return;
    }

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
        tabelaResultado += `<td class="linha-tabela">R$ ${rows[i].valor.replace('.', ',')}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].quant_produzida}</td>`;
        tabelaResultado += `<td class="linha-tabela">${formataData(rows[i].data_validade)}</td>`;
        tabelaResultado += `<td>
                                <div class="is-flex is-gap-3">
                                    <a href="#" class="btn btn-info btn-table" onclick="openForm('editar-produto')">Editar</a>
                                    <a href="#" class="btn btn-danger btn-table" onclick="deletarProduto('${rows[i].nome}', '${rows[i].descr}')">Deletar</a>
                                </div>
                            </td> </tr>`;                  
    }

    tabelaProdutos.innerHTML = tabelaResultado;
}

function novoProduto() {
    const formProduto = document.getElementById('produtos-form');
    if (!formProduto) {
        return;
    }

    formProduto.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome-produto').value;
        const descr = document.getElementById('descr-produto').value;
        const valorString = document.getElementById('valor-produto').value.replace('R$', '').replace(',', '.');
        const valor = parseFloat(valorString);
        const quant = document.getElementById('quant-produto').value;
        const data_validade = document.getElementById('data-produto').value;

        try {
            await axios.post('/api/produto', {nome, descr, valor, quant, data_validade});
            console.log('Produto cadastrado com sucesso!');
            formProduto.reset();
            window.location.href = 'http://localhost:3000/produtos';
        } catch (error) {
            console.log('Ocorreu um erro ao inserir um produto: ', error);
        }
    });
}

function editarProduto() {
    const editarForm = document.getElementById('produtos-editar');
    if (!editarForm) {
        return;
    }

    
}

async function deletarProduto(nome, descr) {
    try {
        await axios.delete('/api/produto', {params: {nome, descr}});
        console.log('Produto deletado com sucesso!');
        window.location.reload();
    } catch (error) {
        console.log('Ocorreu um erro ao deletar um produto: ', error);
    }
}