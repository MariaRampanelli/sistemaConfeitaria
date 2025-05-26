const formatCurrency = (value, currency = 'BRL', localeString = 'pt-BR') => {
    const options = { style: "currency", currency }
    return value.toLocaleString(localeString, options)
}

var inputs = document.querySelectorAll('.mascara-valor');
inputs.forEach((input) => {
    input.addEventListener('input', event => {
        const rawValue = event.target.value;

        // Remove tudo que não for número
        const onlyNumbers = rawValue.replace(/\D/g, '');

        // Divide por 100 para obter valor com centavos
        const numericValue = parseFloat(onlyNumbers) / 100;

        // Formata e atualiza o valor no input
        if (!isNaN(numericValue)) {
            event.target.value = formatCurrency(numericValue);
        } else {
            event.target.value = '';
        }
    })
})