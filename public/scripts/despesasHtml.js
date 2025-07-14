axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

document.addEventListener("DOMContentLoaded", () => {
    tabelaDespesas();
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
        p.textContent = 'Nenhuma despesa cadastrada. Mas assim que cadatrar uma, ela aparecerá aqui!';
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
        tabelaResultado += `<tr> <td class="linha-tabela">${rows[i].valor.replace('.', ',')}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].forma_pagamento}</td>`;
        tabelaResultado += `<td class="linha-tabela">R$ ${rows[i].data_pagamento}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].obs}</td>`;
        tabelaResultado += `<td>
                                <div class="is-flex is-gap-3">
                                    <a href="#" class="btn btn-info btn-table" onclick="abreEditarDespesa('editar-despesa', '${rows[i].id_despesa}')">Editar</a>
                                    <a href="#" class="btn btn-danger btn-table" onclick="deletarDespesa('${rows[i].id_despesa}')">Deletar</a>
                                </div>
                            </td> </tr>`;                  
    }

    tabelaDespesas.innerHTML = tabelaResultado;
}