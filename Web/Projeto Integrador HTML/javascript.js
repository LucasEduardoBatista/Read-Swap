/* Função global (mantida para onclick inline do botão) */
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');

  const btn = document.getElementById('darkModeBtn');
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    if (btn) btn.innerHTML = '<i class="bi bi-brightness-high-fill"></i>';
  } else {
    localStorage.setItem('theme', 'light');
    if (btn) btn.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }
}

/* ----------- Controle de autenticação na navbar ----------- */
function atualizarNavbar() {
  const logado = sessionStorage.getItem('logado') === 'true';

  const elEntrar = document.querySelector('.nav-link.entrar');
  const elCadastrar = document.querySelector('.btn.btn-danger.cadastrar');
  const elPerfil = document.querySelector('.nav-link.perfil');

  const liEntrar = elEntrar ? elEntrar.closest('li') : null;
  const liCadastrar = elCadastrar ? elCadastrar.closest('li') : null;
  const liPerfil = elPerfil ? elPerfil.closest('li') : null;

  if (logado) {
    if (liEntrar) liEntrar.style.display = 'none';
    if (liCadastrar) liCadastrar.style.display = 'none';
    if (liPerfil) liPerfil.style.display = '';
  } else {
    if (liEntrar) liEntrar.style.display = '';
    if (liCadastrar) liCadastrar.style.display = '';
    if (liPerfil) liPerfil.style.display = 'none';
  }
}


function escaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mostrarFeedbackInvalido(form) {
  const invalidElements = form.querySelectorAll('.form-control:invalid, .form-check-input:invalid');
  invalidElements.forEach(function (input) {
    const feedback = input.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.classList.remove('animated');
      void feedback.offsetWidth;
      feedback.classList.add('animated');
    }
  });
}

/* Código que depende do DOM — executa só depois do carregamento */
document.addEventListener('DOMContentLoaded', () => {
  console.log('javascript.js inicializado');

  /* ----------- Atualiza navbar conforme login ----------- */
  atualizarNavbar();

  /* ----------- Ajusta ícone do botão de modo escuro conforme tema salvo ----------- */
  const darkBtn = document.getElementById('darkModeBtn');
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (darkBtn) darkBtn.innerHTML = '<i class="bi bi-brightness-high-fill"></i>';
  } else {
    if (darkBtn) darkBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }

  /* ----------- Mostrar/ocultar senha ----------- */
  const senhaInput = document.getElementById('senha');
  const toggleBtn = document.getElementById('toggleSenha');
  const icone = document.getElementById('iconeSenha');

  if (toggleBtn && senhaInput && icone) {
    toggleBtn.addEventListener('click', function () {
      const tipoAtual = senhaInput.getAttribute('type');
      senhaInput.setAttribute('type', tipoAtual === 'password' ? 'text' : 'password');
      icone.classList.toggle('bi-eye');
      icone.classList.toggle('bi-eye-slash');
    });
  }

  /* ----------- Login ----------- */
  const formLogin = document.getElementById('needs-validation');
  if (formLogin) {
    formLogin.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!formLogin.checkValidity()) {
        mostrarFeedbackInvalido(formLogin);
        formLogin.classList.add('was-validated');
        return;
      }

      formLogin.classList.add('was-validated');
      formLogin.submit();
    });
  }

  /* ----------- Cadastro ----------- */
  const formCadastro = document.getElementById('form-cadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', function (event) {
      event.preventDefault();
      event.stopPropagation();

      const senha = document.getElementById('senha');
      const confirma = document.getElementById('confirmaSenha');

      if (confirma) {
        confirma.setCustomValidity('');
        confirma.classList.remove('is-invalid');
      }

      if (!formCadastro.checkValidity()) {
        mostrarFeedbackInvalido(formCadastro);
        formCadastro.classList.add('was-validated');
        return;
      }

      if (senha && confirma && senha.value !== confirma.value) {
        confirma.setCustomValidity('As senhas não coincidem.');
        confirma.classList.add('is-invalid');

        const feedback = confirma.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
          feedback.classList.remove('animated');
          void feedback.offsetWidth;
          feedback.classList.add('animated');
        }

        formCadastro.classList.add('was-validated');
        return;
      }

      formCadastro.classList.add('was-validated');
      formCadastro.submit();
    });
  }

  const confirmaSenha = document.getElementById('confirmaSenha');
  if (confirmaSenha) {
    confirmaSenha.addEventListener('input', function () {
      this.setCustomValidity('');
      this.classList.remove('is-invalid');
    });
  }

  /* ----------- Logout / exclusão ----------- */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = 'backend/usuarios/logout.php';
    });
  }

  const deleteAccountBtn = document.getElementById('deleteAccountBtn');
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
      const confirmacao = confirm('Tem certeza que deseja excluir sua conta? Essa ação NÃO pode ser desfeita.');
      if (confirmacao) {
        window.location.href = 'backend/usuarios/excluir.php';
      }
    });
  }

  /* ----------- Lógica dos Swaps ----------- */
  const cardContainer = document.getElementById('swapCardContainer');
  const cardImg = cardContainer ? cardContainer.querySelector('img') : null;
  const cardTitle = document.getElementById('bookTitle');
  const cardDesc = document.getElementById('bookDesc');
  const detalhesConteudo = document.getElementById('detalhesConteudo');
  const btnCurtir = document.getElementById('btnCurtir');
  const btnRecusar = document.getElementById('btnRecusar');

  if (cardImg && cardTitle && cardDesc && detalhesConteudo && btnCurtir && btnRecusar) {
    const livros = [
      {
        titulo: "A Rainha Vermelha",
        autor: "Victoria Aveyard",
        img: "./Imagens/livro1.jpg",
        generos: ["Fantasia", "Romance", "Aventura"],
        distancia: "2 Km de você"
      },
      {
        titulo: "1984",
        autor: "George Orwell",
        img: "./Imagens/livro2.jpg",
        generos: ["Distopia", "Ficção Científica"],
        distancia: "4 Km de você"
      },
      {
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        img: "./Imagens/livro3.jpg",
        generos: ["Clássicos", "Drama"],
        distancia: "1,5 Km de você"
      }
    ];

    let index = 0;

    function renderDetalhes(livro) {
      detalhesConteudo.innerHTML = `
        <div class="swap-genres">
          ${livro.generos.map(g => `<span class="swap-genre-chip">${g}</span>`).join('')}
        </div>
        <p class="mt-3 mb-0">${livro.distancia}</p>
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
        } else {
          mostrarLivro(index);
        }
      }, 400);
    }

    mostrarLivro(index);
    btnCurtir.addEventListener("click", () => proximoLivro("like"));
    btnRecusar.addEventListener("click", () => proximoLivro("dislike"));
  }

  /* ----------- Gêneros favoritos no perfil ----------- */
  const checkboxesGenero = document.querySelectorAll('.genero-favorito');
  const chaveGenerosFavoritos = 'generosFavoritos';

  if (checkboxesGenero.length > 0) {
    const salvos = JSON.parse(localStorage.getItem(chaveGenerosFavoritos)) || [];

    checkboxesGenero.forEach((checkbox) => {
      if (salvos.includes(checkbox.value)) {
        checkbox.checked = true;
      }

      checkbox.addEventListener('change', () => {
        const selecionados = Array.from(checkboxesGenero)
          .filter(cb => cb.checked)
          .map(cb => cb.value);

        localStorage.setItem(chaveGenerosFavoritos, JSON.stringify(selecionados));
      });
    });
  }

  /* ----------- Biblioteca do usuário ----------- */
  const bibliotecaContainer = document.getElementById('bibliotecaContainer');
  if (bibliotecaContainer) {
    fetch('backend/livros/listar.php', { headers: { 'Accept': 'application/json' } })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.href = 'login.html';
          return [];
        }
        if (!response.ok) {
          throw new Error('Falha ao carregar livros');
        }
        return response.json();
      })
      .then((livros) => {
        if (!Array.isArray(livros) || livros.length === 0) {
          bibliotecaContainer.innerHTML = `
            <div class="col-12">
              <div class="alert alert-light border text-center mb-0">
                Você ainda não cadastrou livros.
              </div>
            </div>`;
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

          return `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3">
              <div class="card h-100 shadow-sm border-0">
                <img src="${imagem}" class="card-img-top" alt="${titulo}">
                <div class="card-body text-center">
                  <h5 class="card-title fw-semibold">${titulo}</h5>
                  <p class="text-muted small mb-1">${autor}</p>
                  <p class="text-muted small mb-1">${genero}${ano ? ' • ' + ano : ''}</p>
                  <p class="text-muted small mb-3">${editora}${estado ? ' • ' + estado : ''}</p>
                  <div class="d-flex justify-content-center gap-2 flex-wrap">
                    <a href="backend/livros/excluir.php?id=${livro.idLivrosADMs}" class="btn btn-sm btn-outline-secondary px-3" onclick="return confirm('Remover este livro?')">Remover</a>
                  </div>
                </div>
              </div>
            </div>`;
        }).join('');
      })
      .catch((erro) => {
        console.error(erro);
        bibliotecaContainer.innerHTML = `
          <div class="col-12">
            <div class="alert alert-danger text-center mb-0">
              Não foi possível carregar seus livros.
            </div>
          </div>`;
      });
  }

  /* ----------- Dados do perfil para edição ----------- */
  const formEditarPerfil = document.getElementById('formEditarPerfil');
  if (formEditarPerfil) {
    const nomeInputPerfil = document.getElementById('nome');
    const cidadeInputPerfil = document.getElementById('cidade');
    const fotoInputPerfil = document.getElementById('fotoPerfil');
    const previewNome = document.getElementById('previewNome');
    const previewCidade = document.getElementById('previewCidade');
    const previewFoto = document.getElementById('previewFoto');
    const previewGeneros = document.getElementById('previewGeneros');
    const generoChips = document.querySelectorAll('#generosSelecao .genero-chip');

    const renderPreviewGeneros = () => {
      if (!previewGeneros) return;
      previewGeneros.innerHTML = '';
      const selecionados = Array.from(generoChips)
        .filter(chip => chip.querySelector('input')?.checked)
        .map(chip => chip.querySelector('input')?.value)
        .filter(Boolean);

      if (selecionados.length === 0) {
        const vazio = document.createElement('span');
        vazio.className = 'text-muted';
        vazio.textContent = 'Nenhum gênero selecionado';
        previewGeneros.appendChild(vazio);
        return;
      }

      selecionados.forEach(genero => {
        const tag = document.createElement('span');
        tag.className = 'genero-tag';
        tag.textContent = genero;
        previewGeneros.appendChild(tag);
      });
    };

    const atualizarSelecionados = () => {
      generoChips.forEach(chip => {
        const input = chip.querySelector('input');
        chip.classList.toggle('selecionado', !!input?.checked);
      });
      renderPreviewGeneros();
    };

    generoChips.forEach(chip => {
      const input = chip.querySelector('input');
      if (!input) return;
      chip.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'input') return;
        input.checked = !input.checked;
        atualizarSelecionados();
      });
      input.addEventListener('change', atualizarSelecionados);
    });

    if (nomeInputPerfil) {
      nomeInputPerfil.addEventListener('input', () => {
        if (previewNome) previewNome.textContent = nomeInputPerfil.value || 'Seu nome';
      });
    }

    if (cidadeInputPerfil) {
      cidadeInputPerfil.addEventListener('input', () => {
        if (previewCidade) previewCidade.textContent = cidadeInputPerfil.value || 'Sua cidade';
      });
    }

    fetch('backend/perfil/dados.php', { headers: { 'Accept': 'application/json' } })
      .then(async (response) => {
        if (response.status === 401) {
          window.location.href = 'login.html';
          return null;
        }
        if (!response.ok) throw new Error('Falha ao carregar perfil');
        return response.json();
      })
      .then((dados) => {
        if (!dados) return;
        if (nomeInputPerfil) nomeInputPerfil.value = dados.nome || '';
        if (cidadeInputPerfil) cidadeInputPerfil.value = dados.cidade || '';
        if (previewNome) previewNome.textContent = dados.nome || 'Seu nome';
        if (previewCidade) previewCidade.textContent = dados.cidade || 'Sua cidade';
        if (previewFoto && dados.foto) previewFoto.src = dados.foto;

        const generosSalvos = Array.isArray(dados.generos) ? dados.generos : [];
        generoChips.forEach(chip => {
          const input = chip.querySelector('input');
          if (input) input.checked = generosSalvos.includes(input.value);
        });
        atualizarSelecionados();
      })
      .catch((erro) => {
        console.error('Erro ao carregar perfil:', erro);
        atualizarSelecionados();
      });

    if (fotoInputPerfil && previewFoto) {
      fotoInputPerfil.addEventListener('change', function () {
        const file = this.files && this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
          previewFoto.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    formEditarPerfil.addEventListener('submit', function (event) {
      if (!formEditarPerfil.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    const btnRecarregar = document.getElementById('btnRecarregar');
    if (btnRecarregar) {
      btnRecarregar.addEventListener('click', function () {
        window.location.reload();
      });
    }
  }

  /* ----------- Animação de matches ----------- */
  const itens = document.querySelectorAll(".match-item");
  itens.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add("show");
    }, i * 120);
  });

  const chatAtivo = document.querySelector(".chat:not(.d-none)");
  if (chatAtivo) {
    setTimeout(() => {
      chatAtivo.classList.add("show");
    }, 200);
  }
});
