axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

document.addEventListener("DOMContentLoaded", () => {
    tabelaVendas();
    novoVendas();
    editarVendas();
    deletarVendas();
    processaResultadoVendas();
});

function tabelaVendas() {
    axios.get('/api/vendas')
    .then((response) => {
        processaResultadoVendas(response.data);
    }).catch((error) => {
        console.log('Erro ao carregar dados: ', error);
    });
}

function processaResultadoVendas(rows) {
    const tabelaVendas = document.getElementById('tabelaVendas');
    if (!tabelaVendas) {
        return;
    }

    tabelaVendas.innerHTML = '';

    if (rows.length == 0) {
        const p = document.createElement('p');
        p.textContent = 'Nenhuma venda cadastrada. Mas assim que cadatrar um, ele aparecerá aqui!';
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
                <th scope="col" class="coluna-tabela">Nome do cliente</th>
                <th scope="col" class="coluna-tabela">Forma de pagamento</th>
                <th scope="col" class="coluna-tabela">Tipo de entrega</th>
                <th scope="col" class="coluna-tabela">Tipo de venda</th>
                <th scope="col" class="coluna-tabela">Produto</th>
                <th scope="col" class="coluna-tabela">Valor</th>
            </tr>
        </thead>
        <tbody scope="row">`;

    for (let i = 0; i < rows.length; i++) {
        tabelaResultado += `<tr> <td class="linha-tabela">${rows[i].nome_cliente}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].forma_pagamento}</td>`;
        tabelaResultado += `<td class="linha-tabela">R$ ${rows[i].valor.replace('.', ',')}</td>`;
        tabelaResultado += `<td class="linha-tabela">${rows[i].quant_produzida}</td>`;
        tabelaResultado += `<td class="linha-tabela">${formataData(rows[i].data_validade)}</td>`;
        tabelaResultado += `<td>
                                <div class="is-flex is-gap-3">
                                    <a href="#" class="btn btn-info btn-table" onclick="abreEditarProduto('editar-produto', '${rows[i].nome}', '${rows[i].descr}')">Editar</a>
                                    <a href="#" class="btn btn-danger btn-table" onclick="deletarProduto('${rows[i].nome}', '${rows[i].descr}')">Deletar</a>
                                </div>
                            </td> </tr>`;                  
    }

    tabelaProdutos.innerHTML = tabelaResultado;
}

function novoVendas() {
    const formVenda = document.getElementById("venda-form");
    if (!formVenda) return;

    formVenda.addEventListener("submit", async (event) => {
        event.preventDefault();

        const nome_cliente = document.getElementById("nome-cliente").value;
        const forma_pagamento = document.getElementById("forma-pagamento").value;
        const tipo_entrega = document.getElementById("tipo-entrega").value;
        const dataEntrega = document.getElementById("data-entrega").value;

        // Captura os produtos selecionados
        const produtoSelect = document.getElementById('produto');
        const produtosSelecionados = Array.from(produtoSelect.selectedOptions).map(opt =>
        JSON.parse(opt.value)
        );

        if (produtos.length === 0) {
            alert("Selecione pelo menos um produto.");
            return;
        }

        try {
            // Consulta ao backend se os produtos estão no cardápio
            const resposta = await axios.post("/api/verifica-cardapio", { produtos });
            const verificados = resposta.data;

            // Se algum produto não estiver no cardápio, tipo_venda é Encomenda
            const temEncomenda = verificados.some(p => p.tipo === "Encomenda");
            const tipo_venda = temEncomenda ? "Encomenda" : "Cardápio";

            // Envia a venda para o backend
            await axios.post("/api/vendas", {
                nome_cliente,
                forma_pagamento,
                tipo_entrega,
                tipo_venda,
                data_entrega,
                produtos: produtosSelecionados
            });

            alert(`Venda cadastrada como ${tipo_venda} com sucesso!`);
            formVenda.reset();
            window.location.reload();

        } catch (error) {
            console.error("Erro ao cadastrar venda:", error);
            alert("Erro ao cadastrar venda.");
        }
    });
}


async function editarVendas() {
    const editarForm = document.getElementById('produtos-editar');
    if (!editarForm) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const nome = params.get('nome');
    const descr = params.get('descr');

    // Primeiro pega os dados daquele produto
    try {
        const response = await axios.get('/api/produto', {
            params: {nome, descr}
        });

        const produto = response.data;
        console.log(produto)

        document.getElementById('nome-produto-edit').value = produto.nome;
        document.getElementById('data-produto-edit').value = produto.data_validade.split('T')[0];
        document.getElementById('descr-edit').value = produto.descr;
        document.getElementById('valor-edit').value = 'R$' + produto.valor.replace('.', ',');
        document.getElementById('quant-edit').value = produto.quant_produzida;

        editarForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const nomeEdit = document.getElementById('nome-produto-edit').value;
            const descrEdit = document.getElementById('descr-edit').value;
            const valorStringEdit = document.getElementById('valor-edit').value.replace('R$', '').replace(',', '.');
            const valorEdit = parseFloat(valorStringEdit);
            const quantEdit = document.getElementById('quant-edit').value;
            const data_validadeEdit = document.getElementById('data-produto-edit').value;

            try {
                await axios.put('/api/produto', {
                    nome: nomeEdit,
                    descr: descrEdit,
                    valor: valorEdit,
                    quant: quantEdit,
                    data_validade: data_validadeEdit
                });

                console.log('Produto editado com sucesso!');
                alert('Produto editado com sucesso!');
                window.location.href = '/produtos';
            } catch (error) {
                alert('Ocorreu um erro ao editar o produto.');
                console.log('Erro ao editar produto:', error);
            }

        })
    } catch (error) {
        console.log('Ocorreu um erro ao editar o produto: ', error);
    }
}

async function deletarVendas(nome, descr) {
    try {
        await axios.delete('/api/produto', {params: {nome, descr}});
        console.log('Produto deletado com sucesso!');
        alert('Produto deletado com sucesso!');
        window.location.reload();
    } catch (error) {
        alert('Ocorreu um erro ao deletar o produto');
        console.log('Ocorreu um erro ao deletar um produto: ', error);
    }
}