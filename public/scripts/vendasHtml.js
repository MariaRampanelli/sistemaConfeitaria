axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.headers.common["Content-Type"] =
    "application/json;charset=utf-8";

document.addEventListener("DOMContentLoaded", () => {
    tabelaVendas();
    novoVendas();
    editarVendas();
});

async function tabelaVendas() {
    axios.get('/api/vendas')
    .then((response) => {
        processaResultadoVendas(response.data);
    }).catch((error) => {
        console.log('Erro ao carregar dados: ', error);
    });
}

async function processaResultadoVendas(rows) {
  const tabelaVendas = document.getElementById('tabelaVendas');
    if (!tabelaVendas) {
        return;
    }

  tabelaVendas.innerHTML = '';

  if (rows.length === 0) {
    const p = document.createElement('p');
    p.textContent = 'Nenhuma venda cadastrada. Mas assim que cadastrar uma, ela aparecerá aqui!';
    p.style.color = 'black';
    p.classList.add('text-center', 'mt-3');
    p.style.fontWeight = 'bold';
    p.style.fontSize = '1.25rem';
    tabelaVendas.appendChild(p);
    return;
  }

  let tabelaResultado = `
    <table class="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th>Nome do cliente</th>
          <th>Forma de pagamento</th>
          <th>Tipo de entrega</th>
          <th>Tipo de venda</th>
          <th>Produto</th>
          <th>Valor</th>
          <th>Data entrega</th>
        </tr>
      </thead>
      <tbody>`;

  for (let i = 0; i < rows.length; i++) {
    console.log("Venda recebida:", rows[i]);
    const dataFormatada = new Date(rows[i].data_entrega).toLocaleDateString('pt-BR');
    tabelaResultado += `
      <tr>
        <td>${rows[i].nome_cliente}</td>
        <td>${rows[i].forma_pagamento}</td>
        <td>${rows[i].tipo_entrega}</td>
        <td>${rows[i].tipo_venda}</td>
        <td>${rows[i].nome_produto} - ${rows[i].descr_produto}</td>
        <td>R$ ${rows[i].valor.replace('.', ',')}</td>
        <td>${dataFormatada}</td>
        <td>
            <div class="is-flex is-gap-3">
                <a href="/editar-venda?id=${rows[i].id_venda}" class="btn btn-info btn-table">Editar</a>
                <a href="#" class="btn btn-danger btn-table" onclick="deletarVendas('${rows[i].id_venda}')">Deletar</a>
           </div>
        </td>
    </tr>`;
  }

  tabelaResultado += `</tbody></table>`;
  tabelaVendas.innerHTML = tabelaResultado;
}

async function novoVendas() {
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

        if (produtosSelecionados.length === 0) {
            alert("Selecione pelo menos um produto.");
            return;
        }

        try {
            // Consulta ao backend se os produtos estão no cardápio
            const resposta = await axios.post("/api/verifica-cardapio", { produtos: produtosSelecionados });
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
  const editarForm = document.getElementById('venda-edit-form');
  if (!editarForm) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  try {
    const resposta = await axios.get('/api/venda-detalhada', { params: { id } });
    const venda = resposta.data;

    // Preencher campos básicos
    document.getElementById('nome-cliente-edit').value = venda.nome_cliente;
    document.getElementById('forma-pagamento-edit').value = venda.forma_pagamento;
    document.getElementById('tipo-entrega-edit').value = venda.tipo_entrega;
    document.getElementById('data-entrega-edit').value = venda.data_entrega.split('T')[0];
    document.getElementById('tipo-venda-edit').value = venda.tipo_venda;

    // Preencher produtos (exemplo simples com checkbox ou multi-select)
    const produtoSelect = document.getElementById('produtos-edit');
    produtoSelect.innerHTML = '';

    venda.produtos.forEach(produto => {
      const option = document.createElement('option');
      option.value = JSON.stringify(produto);
      option.textContent = `${produto.nome_produto} - ${produto.descr_produto}`;
      option.selected = true;
      produtoSelect.appendChild(option);
    });

    editarForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Coletar dados atualizados
      const nome_cliente = document.getElementById('nome-cliente-edit').value;
      const forma_pagamento = document.getElementById('forma-pagamento-edit').value;
      const tipo_entrega = document.getElementById('tipo-entrega-edit').value;
      const tipo_venda = document.getElementById('tipo-venda-edit').value;
      const data_entrega = document.getElementById('data-entrega-edit').value;

      const produtosSelecionados = Array.from(produtoSelect.selectedOptions).map(opt => JSON.parse(opt.value));

      // Enviar para o backend
      await axios.put('/api/venda', {
        id_venda: id,
        nome_cliente,
        forma_pagamento,
        tipo_entrega,
        tipo_venda,
        data_entrega,
        produtos: produtosSelecionados
      });

      alert('Venda editada com sucesso!');
      window.location.href = '/vendas';
    });

  } catch (error) {
    console.error('Erro ao carregar venda:', error);
    alert('Não foi possível carregar os dados da venda.');
  }
}

async function deletarVendas(id) {
  try {
  await axios.delete('/api/venda', { params: { id } });   
    console.log('Venda deletada com sucesso!');
    alert('Venda deletada com sucesso!');
    window.location.reload();
  } catch (error) {
    alert('Ocorreu um erro ao deletar a venda');
    console.log('Ocorreu um erro ao deletar uma venda:', error);
  }
}