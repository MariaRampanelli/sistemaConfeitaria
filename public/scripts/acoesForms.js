// Cancelar e limpar um formulário
function limparECancelarForm(idForm, urlRedireciona) {
    const form = document.getElementById(idForm);
    form.reset();
    openForm(urlRedireciona);
}