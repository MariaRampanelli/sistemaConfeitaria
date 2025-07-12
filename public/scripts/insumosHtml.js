axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

document.addEventListener("DOMContentLoaded", () => {
    tabelaInsumos();
    novoInsumo();
    editarInsumo();
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

    if (rows.length == 0) {
        const p = document.createElement('p');
        p.textContent = 'Nenhum insumo cadastrado. Mas assim que cadatrar um, ele aparecerá aqui!';
        p.style.color = 'black';
        p.classList.add('text-center', 'mt-3');
        p.style.fontWeight = 'bold';
        p.style.fontSize = '1.25rem';
        document.body.appendChild(p); 
        return;
    }
    

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
                                    <a href="#" class="btn btn-info btn-table" onclick="abreEditarInsumo('editar-insumo', '${rows[i].nome}')">Editar</a>
                                    <a href="#" class="btn btn-danger btn-table" onclick="deletarInsumo('${rows[i].nome}')">Deletar</a>
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
            alert('Insumo cadastrado com sucesso!');
            formInsumo.reset();
            window.location.href = 'http://localhost:3000/insumos';
        } catch (error) {
            alert('Ocorreu um erro ao inserir o insumo');
            console.log('Ocorreu um erro ao inserir um insumo: ', error);
        }
    });
}

async function editarInsumo() {
    const editarForm = document.getElementById('insumos-editar');
    if (!editarForm) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const nome = params.get('nome');

    try {
        const response = await axios.get('/api/insumo', {
            params: {nome}
        });

        const insumo = response.data;

        document.getElementById('nome-insumo-edit').value = insumo.nome;
        document.getElementById('data-insumo-edit').value = insumo.data_compra.split('T')[0];
        document.getElementById('valor-insumo-edit').value = 'R$' + insumo.valor.replace('.', ',');
        document.getElementById('quant-insumo-edit').value = insumo.quant;

        editarForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nomeEdit = document.getElementById('nome-insumo-edit').value;
            const valorStringEdit = document.getElementById('valor-insumo-edit').value.replace('R$', '').replace(',', '.');
            const valorEdit = parseFloat(valorStringEdit);
            const quantEdit = document.getElementById('quant-insumo-edit').value;
            const data_compraEdit = document.getElementById('data-insumo-edit').value;

            try {
                await axios.put('/api/insumo', {
                    nome: nomeEdit,
                    valor: valorEdit,
                    quant: quantEdit,
                    data_compra: data_compraEdit
                });

                console.log('Insumo editado com sucesso!');
                alert('Insumo editado com sucesso!');
                window.location.href = '/insumos';
            } catch (error) {
                alert('Ocorreu um erro ao editar o insumo.');
                console.log('Erro ao editar insumo:', error);
            }

        })
    } catch (error) {
        console.log('Ocorreu um erro ao editar o insumo: ', error);
    }
}

async function deletarInsumo(nome) {
    try {
        await axios.delete('/api/insumo', {params: {nome}});
        console.log('Insumo deletado com sucesso!');
        alert('Insumo deletado com sucesso!');
        window.location.reload();
    } catch (error) {
        alert('Ocorreu um erro ao deletar o insumo');
        console.log('Ocorreu um erro ao deletar um insumo: ', error);
    }
}
