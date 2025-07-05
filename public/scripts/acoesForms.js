// Cancelar e limpar um formulário
function limparECancelarForm(idForm, urlRedireciona) {
    const form = document.getElementById(idForm);
    form.reset();
    openForm(urlRedireciona);
}

// Formatar data
function formataData(dataString) {
    const data = new Date(dataString);
    const dia  = data.getDate().toString();
    const diaF = (dia.length == 1) ? '0' + dia : dia;
    const  mes  = (data.getMonth() + 1).toString();
    const mesF = (mes.length == 1) ? '0' + mes : mes;
    const anoF = data.getFullYear();
    return diaF + "/" + mesF + "/" + anoF;
}