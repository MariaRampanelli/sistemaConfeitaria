axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

document.addEventListener("DOMContentLoaded", () => {
    tabelaDespesas();
    novaDespesa();
});

function tabelaDespesas() {
    axios.get('/api/despesas')
    .then((response) => {
        processaResultadoDespesas(response.data);
    }).catch((error) => {
        console.log('Erro ao carregar dados: ', error);
    });
}

function processaResultadoDespesas(rows) {
    const tabelaDespesas = document.getElementById('tabelaDespesas');
    if (!tabelaDespesas) {
        return;
    }

    tabelaDespesas.innerHTML = '';

    if (rows.length == 0) {
        const p = document.createElement('p');
        p.textContent = 'Nenhuma despesa cadastrada. Mas assim que cadastrar uma, ela aparecerá aqui!';
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
                <th scope="col" class="coluna-tabela">Valor</th>
                <th scope="col" class="coluna-tabela">Forma pagamento</th>
                <th scope="col" class="coluna-tabela">Data pagamento</th>
                <th scope="col" class="coluna-tabela">Observação</th>
            </tr>
        </thead>
        <tbody scope="row">`;

    for (let i = 0; i < rows.length; i++) {
        tabelaResultado += `<tr> <td class="linha-tabela">R$ ${rows[i].valor.replace('.', ',')}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].forma_pagamento}</td>`;
        tabelaResultado += `<td class="linha-tabela">${formataData(rows[i].data_pagamento)}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].obs}</td>`;
        tabelaResultado += `<td>
                                <div class="is-flex is-gap-3">
                                    <a href="/editar-despesa?id=${rows[i].id_despesa}" class="btn btn-info btn-table">Editar</a>
                                    <a href="#" class="btn btn-danger btn-table" onclick="deletarDespesa('${rows[i].id_despesa}')">Deletar</a>
                                </div>
                            </td> </tr>`;                  
    }

    tabelaDespesas.innerHTML = tabelaResultado;
}

function novaDespesa() {
    const formDespesa = document.getElementById('despesa-form');
    if (!formDespesa) {
        return;
    }

    formDespesa.addEventListener('submit', async (event) => {
        event.preventDefault();

        const valorString = document.getElementById('valor-despesa').value.replace('R$', '').replace(',', '.');
        const valor = parseFloat(valorString);
        const pagamento = document.getElementById('forma-pagamento-despesa').value;
        const data = document.getElementById('data-pagamento-despesa').value;
        const obs = document.getElementById('obs-despesa').value;

        try {
            await axios.post('/api/despesa', {valor, pagamento, data, obs});
            console.log('Despesa cadastrada com sucesso!');
            alert('Despesa cadastrada com sucesso!');
            formDespesa.reset();
            window.location.href = 'http://localhost:3000/despesas';
        } catch (error) {
            alert('Ocorreu um erro ao inserir a despesa');
            console.log('Ocorreu um erro ao inserir uma despesa: ', error);
        }
    });
}