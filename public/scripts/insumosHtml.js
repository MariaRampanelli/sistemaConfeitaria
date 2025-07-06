axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

document.addEventListener("DOMContentLoaded", () => {
    tabelaInsumos();
    novoInsumo();
});

function tabelaInsumos() {
    axios.get('/api/insumos')
    .then((response) => {
        processaResultadoInsumo(response.data);
    }).catch((error) => {
        console.log('Erro ao carregar dados: ', error);
    });
}

function processaResultadoInsumo(rows) {
    const tabelaInsumos = document.getElementById('tabelaInsumos');
    if (!tabelaInsumos) {
        return;
    }

    tabelaInsumos.innerHTML = '';

    let tabelaResultado = `
    <table class="table table-striped table-bordered table-hover">
        <thead>
            <tr>
                <th scope="col" class="coluna-tabela">Nome</th>
                <th scope="col" class="coluna-tabela">Valor</th>
                <th scope="col" class="coluna-tabela">Quantidade</th>
                <th scope="col" class="coluna-tabela">Data de compra</th>
            </tr>
        </thead>
        <tbody scope="row">`;

    for (let i = 0; i < rows.length; i++) {
        tabelaResultado += `<tr> <td class="linha-tabela">${rows[i].nome}</td>`;
        tabelaResultado += `<td class="linha-tabela">R$ ${rows[i].valor.replace('.', ',')}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].quant}</td>`;
        tabelaResultado += `<td class="linha-tabela">${formataData(rows[i].data_compra)}</td>`;
        tabelaResultado += `<td>
                                <div class="is-flex is-gap-3">
                                    <a href="#" class="btn btn-info btn-table" onclick="openForm('editar-insumo')">Editar</a>
                                    <a href="#" class="btn btn-danger btn-table" onclick="">Deletar</a>
                                </div>
                            </td> </tr>`;                  
    }

    tabelaInsumos.innerHTML = tabelaResultado;
}

function novoInsumo() {
    const formInsumo = document.getElementById('insumos-form');
    if (!formInsumo) {
        return;
    }

    formInsumo.addEventListener('submit', async (event) => {
        event.preventDefault();

        const nome = document.getElementById('nome-insumo').value;
        const valorString = document.getElementById('valor-insumo').value.replace('R$', '').replace(',', '.');
        const valor = parseFloat(valorString);
        const quant = document.getElementById('quant-insumo').value;
        const dataCompra = document.getElementById('data-insumo').value;

        try {
            await axios.post('/api/insumo', {nome,valor, quant, dataCompra});
            console.log('Insumo cadastrado com sucesso!');
            formInsumo.reset();
            window.location.href = 'http://localhost:3000/insumos';
        } catch (error) {
            console.log('Ocorreu um erro ao inserir um insumo: ', error);
        }
    });
}
