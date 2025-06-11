async function inserirHtml(id, arquivo) {
    const url = 'http://localhost:3000/' + arquivo;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro na requisição de página: ${url}. Status: ${response.status}`);
        }

        const html = await response.text();
        document.getElementById(id).innerHTML = html;

    } catch (error) {
        console.log('Ocorreu um erro: ', error)
    }
}

function openForm(url) {
    window.location.href = 'http://localhost:3000/' + url;
}

document.addEventListener('DOMContentLoaded', () => {
    inserirHtml('side-menu', 'menu-lateral');
})