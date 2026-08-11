import { escaparHtml } from './common.js';

export function inicializarBiblioteca() {
const bibliotecaContainer = document.getElementById('bibliotecaContainer');
  if (bibliotecaContainer) {
    fetch('backend/livros/listar.php', { headers: { 'Accept': 'application/json' } })
      .then(async (response) => {
        if (response.status === 401) { window.location.href = 'login.html'; return []; }
        if (!response.ok) throw new Error('Falha ao carregar livros');
        return response.json();
      })
      .then((livros) => {
        if (!Array.isArray(livros) || livros.length === 0) {
          bibliotecaContainer.innerHTML = `<div class="col-12"><div class="alert alert-light border text-center mb-0">Você ainda não cadastrou livros.</div></div>`;
          return;
        }
        bibliotecaContainer.innerHTML = livros.map((livro) => {
          const titulo = escaparHtml(livro.Nome);
          const autor = escaparHtml(livro.Autor);
          const genero = escaparHtml(livro.Genero);
          const editora = escaparHtml(livro.Editora);
          const ano = escaparHtml(livro.Ano);
          const estado = escaparHtml(livro.Estado);
          const imagem = livro.foto || './Imagens/sem_livros.png';
          const status = escaparHtml(livro.status);
          const troca = escaparHtml(livro.status) == 'Livro já trocado'? 'Não trocado?':'Livro trocado?';
          const quest = escaparHtml(livro.status) == 'Livro já trocado'? 'Deseja marcar como não trocado?':'Esse livro foi mesmo trocado?'
          return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <div class="card h-100 shadow-sm border-0">
                <img src="${imagem}" class="card-img-top" alt="${titulo}">
                <div class="card-body text-center">
                  <h5 class="card-title fw-semibold">${titulo}</h5>
                  <p class="text-muted small mb-1">${autor}</p>
                  <p class="text-muted small mb-1">${genero}${ano ? ' • ' + ano : ''}</p>
                  <p class="text-muted small mb-1">${editora}${estado ? ' • ' + estado : ''}</p>
                  <p class="text-muted small mb-1">${status}</p>
                  <div class="d-flex justify-content-center gap-2 flex-wrap">
                    <a href="backend/livros/excluir.php?id=${livro.idLivrosADMs}" class="btn btn-sm btn-outline-secondary px-3" onclick="return confirm('Remover este livro?')">Remover</a>
                    <a href="backend/livros/trocados.php?id=${livro.idLivrosADMs}" class="btn btn-sm btn-outline-secondary px-3" onclick="return confirm('${quest}')">${troca}</a>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');
      })
      .catch((erro) => {
        console.error(erro);
        bibliotecaContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger text-center mb-0">Não foi possível carregar seus livros.</div></div>`;
      });
  }
}
