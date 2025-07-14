function openForm(url) {
    window.location.href = 'http://localhost:3000/' + url;
}

function abreEditarProduto(url, nome, descr) {
    const urlEditar = `?nome=${nome}&descr=${descr}`;
    window.location.href = 'http://localhost:3000/' + url + urlEditar;
}

function abreEditarInsumo(url, nome) {
    const urlEditar = `?nome=${nome}`;
    window.location.href = 'http://localhost:3000/' + url + urlEditar;
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}
