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

  const elEntrar    = document.querySelector('.nav-link.entrar');
  const elCadastrar = document.querySelector('.btn.btn-danger.cadastrar');
  const elPerfil    = document.querySelector('.nav-link.perfil');
  const liEntrar    = elEntrar    ? elEntrar.closest('li')    : null;
  const liCadastrar = elCadastrar ? elCadastrar.closest('li') : null;
  const liPerfil    = elPerfil    ? elPerfil.closest('li')    : null;

  if (logado) {
    if (liEntrar)    liEntrar.style.display    = 'none';
    if (liCadastrar) liCadastrar.style.display = 'none';
    if (liPerfil)    liPerfil.style.display    = '';
  } else {
    if (liEntrar)    liEntrar.style.display    = '';
    if (liCadastrar) liCadastrar.style.display = '';
    if (liPerfil)    liPerfil.style.display    = 'none';
  }
}





async function criptografarSenha(senha) {
  const encoder = new TextEncoder();
  const dados = encoder.encode(senha);

  const hashBuffer = await crypto.subtle.digest("SHA-256", dados);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
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

  /* ----------- Mostrar/ocultar senha (aplica somente se elementos existirem) ----------- */
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
  } else {
    // elementos de senha não existem nesta página — ok
    // console.log('toggleSenha não encontrado nesta página (normal se não houver formulário de login).');
  }

  /* ----------- Validação de formulário (aplica só se houver o form com id needs-validation) ----------- */
  const form = document.getElementById('needs-validation');
  if (form) {
    (function () {
      'use strict';
      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
          const invalidElements = form.querySelectorAll('.form-control:invalid');
          invalidElements.forEach(function (input) {
            const feedback = input.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
              feedback.classList.remove('animated');
              void feedback.offsetWidth;
              feedback.classList.add('animated');
            }
          });
          form.classList.add('was-validated');
          return;
        }

        form.classList.add('was-validated');

        // Verifica credenciais contra usuários cadastrados
        const emailInput = document.getElementById('login');
        const senhaLoginEl = document.getElementById('senha');
        const emailVal = emailInput ? emailInput.value.trim() : '';
        const senhaVal = senhaLoginEl ? senhaLoginEl.value : '';

        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const senhaHash = await criptografarSenha(senhaVal);
        const usuario = usuarios.find(u => u.email === emailVal && u.senha === senhaHash);

        if (!usuario) {
          alert('E-mail ou senha incorretos. Verifique seus dados ou cadastre-se.');
          return;
        }

        sessionStorage.setItem('logado', 'true');
        sessionStorage.setItem('usuarioEmail', usuario.email);
        sessionStorage.setItem('usuarioNome', usuario.nome);
        window.location.href = 'index.html';
      }, false);
    })();
  }

  /* ----------- Validação de formulário de cadastro ----------- */
const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
  (function () {
    'use strict';
    formCadastro.addEventListener('submit', async function (event) {
      event.preventDefault();
      event.stopPropagation();

      const senha = document.getElementById('senha');
      const confirma = document.getElementById('confirmaSenha');

      if (confirma) {
        confirma.setCustomValidity("");
        confirma.classList.remove("is-invalid");
      }

      if (!formCadastro.checkValidity()) {
        const invalidElements = formCadastro.querySelectorAll('.form-control:invalid, .form-check-input:invalid');
        invalidElements.forEach(function (input) {
          const feedback = input.parentNode.querySelector('.invalid-feedback');
          if (feedback) {
            feedback.classList.remove('animated');
            void feedback.offsetWidth;
            feedback.classList.add('animated');
          }
        });
        formCadastro.classList.add('was-validated');
        return;
      }

      // Verifica se as senhas coincidem
      if (senha && confirma && senha.value !== confirma.value) {
        confirma.setCustomValidity("As senhas não coincidem.");
        confirma.classList.add("is-invalid");

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

      // Salva usuário na lista e inicia sessão
      const nomeInput  = document.getElementById('nome');
      const emailInput = document.getElementById('email');
      const senhaFinal = document.getElementById('senha');
      const nomeVal    = nomeInput  ? nomeInput.value.trim()  : '';
      const emailVal   = emailInput ? emailInput.value.trim() : '';
      const senhaVal   = senhaFinal ? senhaFinal.value : '';
      const senhaHash  = await criptografarSenha(senhaVal);

      // Verifica se e-mail já está cadastrado
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const jaExiste = usuarios.find(u => u.email === emailVal);
      if (jaExiste) {
        alert('Este e-mail já está cadastrado. Faça login.');
        window.location.href = 'login.html';
        return;
      }

      // Adiciona novo usuário à lista
      usuarios.push({ nome: nomeVal, email: emailVal, senha: senhaHash });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      // Inicia sessão (dura até fechar a aba)
      sessionStorage.setItem('logado', 'true');
      sessionStorage.setItem('usuarioEmail', emailVal);
      sessionStorage.setItem('usuarioNome', nomeVal);
      window.location.href = 'index.html';
    }, false);
  })();
}

const confirmaSenha = document.getElementById('confirmaSenha');

if (confirmaSenha) {
  confirmaSenha.addEventListener('input', function () {
    this.setCustomValidity("");
    this.classList.remove("is-invalid");
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
    void cardContainer.offsetWidth; // força reflow porque frontend adora drama

    cardContainer.classList.add("slide-in-right");

    btnCurtir.disabled = false;
    btnRecusar.disabled = false;
  }

  function proximoLivro(direcao) {
    btnCurtir.disabled = true;
    btnRecusar.disabled = true;

    cardContainer.classList.add(
      direcao === "like" ? "slide-out-right" : "slide-out-left"
    );

    setTimeout(() => {
      index++;

      cardContainer.classList.remove(
        "slide-out-right",
        "slide-out-left"
      );

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

}); // fim DOMContentLoaded


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
    document.addEventListener("DOMContentLoaded", () => {

  // anima matches em sequência
  const itens = document.querySelectorAll(".match-item");

  itens.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add("show");
    }, i * 120);
  });

  // anima chat inicial
  const chatAtivo = document.querySelector(".chat:not(.d-none)");
  if (chatAtivo) {
    setTimeout(() => {
      chatAtivo.classList.add("show");
    }, 200);
  }

});
  }