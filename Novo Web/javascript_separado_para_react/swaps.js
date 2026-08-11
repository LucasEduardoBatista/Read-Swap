export function inicializarSwaps() {
const cardContainer = document.getElementById('swapCardContainer');
  const cardImg = cardContainer ? cardContainer.querySelector('img') : null;
  const cardTitle = document.getElementById('bookTitle');
  const cardDesc = document.getElementById('bookDesc');
  const detalhesConteudo = document.getElementById('detalhesConteudo');
  const detalhesLateral = document.getElementById('detalhesLateral');
  const btnDetalhes = document.getElementById('btnDetalhes');
  const btnCurtir = document.getElementById('btnCurtir');
  const btnRecusar = document.getElementById('btnRecusar');

  if (cardImg && cardTitle && cardDesc && detalhesConteudo && detalhesLateral && btnDetalhes && btnCurtir && btnRecusar) {
    const livros = [
      { titulo: "A Rainha Vermelha", autor: "Victoria Aveyard", img: "./Imagens/livro1.jpg", generos: ["Fantasia", "Romance", "Aventura"], distancia: "2 Km de você" },
      { titulo: "1984", autor: "George Orwell", img: "./Imagens/livro2.jpg", generos: ["Distopia", "Ficção Científica"], distancia: "4 Km de você" },
      { titulo: "Dom Casmurro", autor: "Machado de Assis", img: "./Imagens/livro3.jpg", generos: ["Clássicos", "Drama"], distancia: "1,5 Km de você" }
    ];
    let index = 0;
    let detalhesAbertos = false;

    function renderDetalhes(livro) {
     
      detalhesConteudo.innerHTML = `
        <div class="swap-genres">${livro.generos.map(g => `<span class="swap-genre-chip">${g}</span>`).join('')}</div>
        <p class="mt-2 mb-0">${livro.distancia}</p>
      `;

      
      const generosHtml = livro.generos.map(g => `
        <div class="genero-item">
          <i class="bi bi-bookmark-fill"></i>
          <span>${g}</span>
        </div>
      `).join('');

      detalhesLateral.innerHTML = `
        <h6><i class="bi bi-tags-fill"></i> Gêneros</h6>
        ${generosHtml}
        <p style="margin-top: 12px; font-size: 0.85rem; color: #888;">
          <i class="bi bi-geo-alt"></i> ${livro.distancia}
        </p>
      `;
    }

    function mostrarLivro(i) {
      const livro = livros[i];
      cardImg.src = livro.img;
      cardTitle.textContent = livro.titulo;
      cardDesc.textContent = livro.autor;
      renderDetalhes(livro);
      cardContainer.classList.remove("slide-in-left", "slide-in-right");
      void cardContainer.offsetWidth;
      cardContainer.classList.add("slide-in-right");
      btnCurtir.disabled = false;
      btnRecusar.disabled = false;

    
      if (detalhesAbertos) {
        detalhesLateral.classList.remove('visivel');
        detalhesAbertos = false;
      }
    }

    function proximoLivro(direcao) {
      btnCurtir.disabled = true;
      btnRecusar.disabled = true;
      cardContainer.classList.add(direcao === "like" ? "slide-out-right" : "slide-out-left");
      setTimeout(() => {
        index++;
        cardContainer.classList.remove("slide-out-right", "slide-out-left");
        if (index >= livros.length) {
          cardTitle.textContent = "Fim dos livros!";
          cardDesc.textContent = "Nenhum livro restante na sua região.";
          cardImg.src = "./Imagens/sem_livros.png";
          detalhesConteudo.innerHTML = `<p>Sem mais livros por perto.</p>`;
          detalhesLateral.innerHTML = `<p class="text-muted">Nenhum livro disponível.</p>`;
          if (detalhesAbertos) {
            detalhesLateral.classList.remove('visivel');
            detalhesAbertos = false;
          }
        } else {
          mostrarLivro(index);
        }
      }, 400);
    }

   
    btnDetalhes.addEventListener('click', function(e) {
      e.stopPropagation();
      detalhesAbertos = !detalhesAbertos;
      if (detalhesAbertos) {
        detalhesLateral.classList.add('visivel');
       
        const livroAtual = livros[index];
        if (livroAtual) {
          const generosHtml = livroAtual.generos.map(g => `
            <div class="genero-item">
              <i class="bi bi-bookmark-fill"></i>
              <span>${g}</span>
            </div>
          `).join('');
          detalhesLateral.innerHTML = `
            <h6><i class="bi bi-tags-fill"></i> Gêneros</h6>
            ${generosHtml}
            <p style="margin-top: 12px; font-size: 0.85rem; color: #888;">
              <i class="bi bi-geo-alt"></i> ${livroAtual.distancia}
            </p>
          `;
        }
      } else {
        detalhesLateral.classList.remove('visivel');
      }
    });

    
    document.addEventListener('click', function(e) {
      if (detalhesAbertos && !e.target.closest('.swap-wrapper')) {
        detalhesLateral.classList.remove('visivel');
        detalhesAbertos = false;
      }
    });

    mostrarLivro(index);
    btnCurtir.addEventListener("click", () => proximoLivro("like"));
    btnRecusar.addEventListener("click", () => proximoLivro("dislike"));
  }
}
