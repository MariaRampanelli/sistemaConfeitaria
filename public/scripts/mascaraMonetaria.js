const formatCurrency = (value, currency = 'BRL', localeString = 'pt-BR') => {
    const options = { style: "currency", currency }
    return value.toLocaleString(localeString, options)
}

var inputs = document.querySelectorAll('.mascara-valor');
inputs.forEach((input) => {
    input.addEventListener('input', event => {
        const valorOriginal = event.target.value;

        // Remove tudo que não for número
        const valorFiltrado = valorOriginal.replace(/\D/g, '');

        // Divide por 100 para obter valor com centavos
        const valorFinal = parseFloat(valorFiltrado) / 100;

        // Formata e atualiza o valor no input
        if (!isNaN(valorFinal)) {
            event.target.value = formatCurrency(valorFinal);
        } else {
            event.target.value = '';
        }
    })
})