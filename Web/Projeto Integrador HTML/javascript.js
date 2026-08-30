const paginasProtegidas = new Set([
    'biblioteca.html',
    'livros.html',
    'swaps.html',
    'matches.html',
    'perfil.html',
    'editarperfil.html',
    'configuracoes.html',
    'premium.html'
]);

async function verificarAutenticacao() {
    const paginaAtual = decodeURIComponent(window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (!paginasProtegidas.has(paginaAtual)) return true;

    try {
        const resposta = await fetch('./backend/usuarios/sessao.php', {
            headers: { 'Accept': 'application/json' },
            cache: 'no-store'
        });
        if (!resposta.ok) throw new Error('Sessão inválida');
        const dados = await resposta.json();
        if (!dados.autenticado) throw new Error('Sessão inválida');

        sessionStorage.setItem('logado', 'true');
        sessionStorage.setItem('usuarioNome', dados.usuario.nome);
        sessionStorage.setItem('usuarioEmail', dados.usuario.email);
        return true;
    } catch (_) {
        sessionStorage.removeItem('logado');
        sessionStorage.removeItem('usuarioNome');
        sessionStorage.removeItem('usuarioEmail');
        const retorno = encodeURIComponent(paginaAtual);
        window.location.replace(`login.html?retorno=${retorno}`);
        return false;
    }
}

const autenticacaoPronta = verificarAutenticacao();

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
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) darkModeSwitch.checked = document.body.classList.contains('dark-mode');
}

function atualizarNavbar() {
    const logado = sessionStorage.getItem('logado') === 'true';
    const elEntrar = document.querySelector('.nav-link.entrar');
    const elCadastrar = document.querySelector('.btn.btn-danger.cadastrar');
    const elPerfil = document.querySelector('.nav-link.perfil');
    const liEntrar = elEntrar?.closest('li');
    const liCadastrar = elCadastrar?.closest('li');
    const liPerfil = elPerfil?.closest('li');

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
    invalidElements.forEach(input => {
        const feedback = input.parentNode.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.classList.remove('animated');
            void feedback.offsetWidth;
            feedback.classList.add('animated');
        }
    });
}


async function iniciarChat() {
    const lista = document.getElementById('conversationsList');
    const mensagensEl = document.getElementById('chatMessages');
    const input = document.getElementById('chatInput');
    const botao = document.getElementById('chatSend');
    if (!lista || !mensagensEl || !input || !botao) return;
    let contatoAtual = null;
    const formatarHora = data => data ? new Date(data.replace(' ', 'T')).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

    async function abrirContato(contato, item) {
        contatoAtual = contato.id;
        document.querySelectorAll('.match-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        document.getElementById('chatUserName').textContent = contato.nome;
        document.getElementById('chatAvatar').src = contato.foto;
        input.disabled = botao.disabled = false;
        mensagensEl.innerHTML = '<div class="text-muted text-center p-3">Carregando...</div>';
        const resposta = await fetch(`./backend/conversas/conversas.php?acao=mensagens&contato_id=${contato.id}`);
        const mensagens = await resposta.json();
        mensagensEl.innerHTML = mensagens.length
            ? mensagens.map(msg => `<div class="message ${msg.tipo}">${escaparHtml(msg.texto)} <span class="msg-time">${formatarHora(msg.data)}</span></div>`).join('')
            : '<div class="text-muted text-center p-4">Envie a primeira mensagem.</div>';
        mensagensEl.scrollTop = mensagensEl.scrollHeight;
    }

    async function carregarContatos() {
        try {
            const resposta = await fetch('./backend/conversas/conversas.php?acao=contatos');
            if (!resposta.ok) throw new Error();
            const contatos = await resposta.json();
            lista.className = '';
            lista.innerHTML = contatos.length ? '' : '<div class="p-3 text-muted">Curta um livro no Swap para iniciar uma conversa.</div>';
            contatos.forEach(contato => {
                const item = document.createElement('div');
                item.className = 'match-item';
                item.innerHTML = `<img src="${contato.foto}" class="match-cover" alt=""><div class="match-info"><strong>${escaparHtml(contato.nome)}</strong><span class="last-msg">${escaparHtml(contato.ultimaMensagem || 'Novo match')}</span><span class="msg-time">${formatarHora(contato.ultimaData)}</span></div>`;
                item.addEventListener('click', () => abrirContato(contato, item));
                lista.appendChild(item);
            });
            if (contatos.length) abrirContato(contatos[0], lista.querySelector('.match-item'));
        } catch (_) {
            lista.innerHTML = '<div class="p-3 text-danger">Não foi possível carregar as conversas.</div>';
        }
    }

    async function enviarMensagem() {
        const conteudo = input.value.trim();
        if (!conteudo || !contatoAtual) return;
        botao.disabled = true;
        const dados = new URLSearchParams({ acao: 'enviar', contato_id: contatoAtual, conteudo });
        const resposta = await fetch('./backend/conversas/conversas.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: dados });
        botao.disabled = false;
        if (!resposta.ok) return alert('Não foi possível enviar a mensagem.');
        input.value = '';
        const item = document.querySelector('.match-item.active');
        await abrirContato({ id: contatoAtual, nome: document.getElementById('chatUserName').textContent, foto: document.getElementById('chatAvatar').src }, item);
        input.focus();
    }
    botao.addEventListener('click', enviarMensagem);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); enviarMensagem(); } });
    carregarContatos();
}


document.addEventListener('DOMContentLoaded', async function() {
    document.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', event => {
            const destino = new URL(link.href, window.location.href);
            const mesmaPagina = destino.origin === window.location.origin
                && destino.pathname === window.location.pathname
                && destino.search === window.location.search
                && !destino.hash;
            if (mesmaPagina) event.preventDefault();
        });
    });

    if (!(await autenticacaoPronta)) return;
    console.log('javascript.js carregado');

    
    atualizarNavbar();

   
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.remove('dark-mode');
        const btn = document.getElementById('darkModeBtn');
        if (btn) btn.innerHTML = '<i class="bi bi-brightness-high-fill"></i>';
    }


    iniciarChat();

  
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


    const formLogin = document.getElementById('needs-validation');
    if (formLogin) {
        const retornoLogin = document.getElementById('retornoLogin');
        const retornoUrl = new URLSearchParams(window.location.search).get('retorno');
        if (retornoLogin && retornoUrl && paginasProtegidas.has(retornoUrl.toLowerCase())) {
            retornoLogin.value = retornoUrl.toLowerCase();
        }
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


    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const senha = document.getElementById('senha');
            const confirma = document.getElementById('confirmaSenha');
            const email = document.getElementById('email');
            const confirmaEmailCadastro = document.getElementById('confirmaEmail');
            if (confirma) {
                confirma.setCustomValidity('');
                confirma.classList.remove('is-invalid');
                const feedbackConfirma = confirma.parentNode.querySelector('.invalid-feedback');
                if (feedbackConfirma) feedbackConfirma.textContent = 'A confirmação deve ter entre 8 e 72 caracteres.';
            }
            if (confirmaEmailCadastro) {
                confirmaEmailCadastro.setCustomValidity('');
                confirmaEmailCadastro.classList.remove('is-invalid');
            }
            if (email && confirmaEmailCadastro && email.value.trim().toLowerCase() !== confirmaEmailCadastro.value.trim().toLowerCase()) {
                confirmaEmailCadastro.setCustomValidity('Os endereços de e-mail não coincidem.');
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
                    feedback.textContent = 'As senhas não coincidem.';
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
            const feedback = this.parentNode.querySelector('.invalid-feedback');
            if (feedback) feedback.textContent = 'A confirmação deve ter entre 8 e 72 caracteres.';
        });
    }

    const darkModeSwitch = document.getElementById('darkModeSwitch');
    if (darkModeSwitch) {
        darkModeSwitch.checked = document.body.classList.contains('dark-mode');
        darkModeSwitch.addEventListener('change', () => {
            const estaEscuro = document.body.classList.contains('dark-mode');
            if (darkModeSwitch.checked !== estaEscuro) toggleDarkMode();
        });
    }
    document.querySelectorAll('.preference-switch').forEach(controle => {
        const chave = `preferencia_${controle.dataset.preference}`;
        const valorSalvo = localStorage.getItem(chave);
        if (valorSalvo !== null) controle.checked = valorSalvo === 'true';
        controle.addEventListener('change', () => localStorage.setItem(chave, String(controle.checked)));
    });
    const confirmaEmail = document.getElementById('confirmaEmail');
    if (confirmaEmail) {
        confirmaEmail.addEventListener('input', function () {
            this.setCustomValidity('');
            this.classList.remove('is-invalid');
        });
    }


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

    
    const cardContainer = document.getElementById('swapCardContainer');
    const cardImg = cardContainer ? cardContainer.querySelector('img') : null;
    const cardTitle = document.getElementById('bookTitle');
    const cardDesc = document.getElementById('bookDesc');
    const detalhesConteudo = document.getElementById('detalhesConteudo');
    const detalhesLateral = document.getElementById('detalhesLateral');
    const btnDetalhes = document.getElementById('btnDetalhes');
    const btnCurtir = document.getElementById('btnCurtir');
    const btnRecusar = document.getElementById('btnRecusar');
    const ownerPanel = document.getElementById('swapOwnerPanel');
    const ownerPhoto = document.getElementById('swapOwnerPhoto');
    const ownerName = document.getElementById('swapOwnerName');
    const ownerCity = document.getElementById('swapOwnerCity');

    if (cardImg && cardTitle && cardDesc && detalhesConteudo && detalhesLateral && btnDetalhes && btnCurtir && btnRecusar) {
        let livros = [];
        let index = 0;
        let detalhesAbertos = false;

        function renderDetalhes(livro) {
       
            detalhesConteudo.innerHTML = `
                <div class="swap-genres">${livro.generos.map(g => `<span class="swap-genre-chip">${g}</span>`).join('')}</div>
                <p class="mt-2 mb-0"><strong>Dono:</strong> ${escaparHtml(livro.dono)}</p>
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
                    <i class="bi bi-geo-alt"></i> ${escaparHtml(livro.cidade || 'Localização não informada')}
                    <br><i class="bi bi-book"></i> ${escaparHtml(livro.estado || 'Estado não informado')}
                </p>
            `;
        }

        function mostrarLivro(i) {
            const livro = livros[i];
            cardImg.src = livro.img;
            cardTitle.textContent = livro.titulo;
            cardDesc.textContent = livro.autor;
            if (ownerPanel && ownerPhoto && ownerName && ownerCity) {
                ownerPhoto.src = livro.fotoDono || './Imagens/default-profile.jpg';
                ownerPhoto.alt = `Foto de ${livro.dono || 'usuário'}`;
                ownerName.textContent = livro.dono || 'Usuário';
                ownerCity.innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${escaparHtml(livro.cidade || 'Cidade não informada')}`;
                ownerPanel.hidden = false;
            }
            renderDetalhes(livro);
            cardContainer.classList.remove("slide-in-left", "slide-in-right");
            void cardContainer.offsetWidth;
            cardContainer.classList.add("slide-in-right");
            btnDetalhes.disabled = false;
            btnCurtir.disabled = false;
            btnRecusar.disabled = false;

      
            if (detalhesAbertos) {
                detalhesLateral.classList.remove('visivel');
                detalhesAbertos = false;
            }
        }

        async function proximoLivro(direcao) {
            const livroAtual = livros[index];
            if (!livroAtual) return;
            btnCurtir.disabled = true;
            btnRecusar.disabled = true;
            try {
                const dados = new URLSearchParams({ livro_id: livroAtual.id, gostou: direcao === 'like' ? 1 : 0 });
                const resposta = await fetch('./backend/swaps/avaliar.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: dados });
                if (!resposta.ok) throw new Error();
            } catch (_) {
                btnCurtir.disabled = false;
                btnRecusar.disabled = false;
                alert('Não foi possível registrar sua escolha.');
                return;
            }
            cardContainer.classList.add(direcao === "like" ? "slide-out-right" : "slide-out-left");
            setTimeout(() => {
                index++;
                cardContainer.classList.remove("slide-out-right", "slide-out-left");
                if (index >= livros.length) {
                    if (ownerPanel) ownerPanel.hidden = true;
                    cardTitle.textContent = "Fim dos livros!";
                    cardDesc.textContent = "Nenhum livro restante na sua região.";
                    cardImg.src = "./Imagens/sem_livros.png";
                    detalhesConteudo.innerHTML = `<p>Sem mais livros por perto.</p>`;
                    detalhesLateral.innerHTML = `<p class="text-muted">Nenhum livro disponível.</p>`;
                    btnDetalhes.disabled = true;
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
                            <i class="bi bi-geo-alt"></i> ${escaparHtml(livroAtual.cidade || 'Localização não informada')}
                            <br><i class="bi bi-person"></i> ${escaparHtml(livroAtual.dono)}
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

        fetch('./backend/swaps/listar.php', { headers: { 'Accept': 'application/json' } })
            .then(resposta => {
                if (!resposta.ok) throw new Error();
                return resposta.json();
            })
            .then(dados => {
                livros = dados;
                if (livros.length) mostrarLivro(index);
                else {
                    cardTitle.textContent = 'Nenhum livro disponível';
                    cardDesc.textContent = 'Volte mais tarde para descobrir novos livros.';
                    cardImg.src = './Imagens/sem_livros.png';
                    detalhesLateral.innerHTML = '<p class="text-muted">Nenhum livro disponível.</p>';
                    btnDetalhes.disabled = true;
                    btnCurtir.disabled = btnRecusar.disabled = true;
                    if (ownerPanel) ownerPanel.hidden = true;
                }
            })
            .catch(() => {
                cardTitle.textContent = 'Não foi possível carregar os livros';
                cardDesc.textContent = 'Entre na sua conta e tente novamente.';
                cardImg.src = './Imagens/sem_livros.png';
                btnDetalhes.disabled = true;
                btnCurtir.disabled = btnRecusar.disabled = true;
                if (ownerPanel) ownerPanel.hidden = true;
            });
        btnCurtir.addEventListener("click", () => proximoLivro("like"));
        btnRecusar.addEventListener("click", () => proximoLivro("dislike"));
    }

  
    const checkboxesGenero = document.querySelectorAll('.genero-favorito');
    const chaveGenerosFavoritos = 'generosFavoritos';
    if (checkboxesGenero.length > 0) {
        const salvos = JSON.parse(localStorage.getItem(chaveGenerosFavoritos)) || [];
        checkboxesGenero.forEach(checkbox => {
            if (salvos.includes(checkbox.value)) checkbox.checked = true;
            checkbox.addEventListener('change', () => {
                const selecionados = Array.from(checkboxesGenero).filter(cb => cb.checked).map(cb => cb.value);
                localStorage.setItem(chaveGenerosFavoritos, JSON.stringify(selecionados));
            });
        });
    }

 
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
                    bibliotecaContainer.innerHTML = `<div class="col-12"><div class="library-empty-state"><div><i class="bi bi-bookshelf"></i></div><h3>Sua estante está vazia</h3><p>Cadastre o primeiro livro para começar a trocar histórias com outros leitores.</p><a href="livros.html" class="btn btn-danger"><i class="bi bi-plus-lg"></i> Cadastrar primeiro livro</a></div></div>`;
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
                    const trocado = livro.status === 'Livro já trocado';
                    const troca = trocado ? 'Marcar como disponível' : 'Marcar como trocado';
                    const quest = trocado ? 'Deseja marcar como não trocado?' : 'Esse livro foi mesmo trocado?';
                    return `
                        <div class="col-12 col-xl-6">
                            <article class="library-book-card">
                                <div class="library-book-cover"><img src="${imagem}" alt="Capa de ${titulo}"><span class="library-status ${trocado ? 'is-traded' : 'is-available'}">${status}</span></div>
                                <div class="library-book-info">
                                    <div><span class="library-book-genre">${genero || 'Sem gênero'}</span><h3>${titulo}</h3><p class="library-book-author">por ${autor || 'Autor não informado'}</p></div>
                                    <div class="library-book-meta">
                                      ${ano ? `<span><i class="bi bi-calendar3"></i> ${ano}</span>` : ''}
                                      ${editora ? `<span><i class="bi bi-building"></i> ${editora}</span>` : ''}
                                      ${estado ? `<span><i class="bi bi-shield-check"></i> ${estado}</span>` : ''}
                                    </div>
                                    <div class="library-book-actions">
                                        <a href="backend/livros/trocados.php?id=${livro.idLivrosADMs}" class="btn btn-sm btn-danger" onclick="return confirm('${quest}')"><i class="bi bi-arrow-repeat"></i> ${troca}</a>
                                        <a href="backend/livros/excluir.php?id=${livro.idLivrosADMs}" class="btn btn-sm btn-outline-secondary" onclick="return confirm('Remover este livro?')"><i class="bi bi-trash3"></i> Remover</a>
                                    </div>
                                </div>
                            </article>
                        </div>
                    `;
                }).join('');
            })
            .catch((erro) => {
                console.error(erro);
                bibliotecaContainer.innerHTML = `<div class="col-12"><div class="alert alert-danger text-center mb-0">Não foi possível carregar seus livros.</div></div>`;
            });
    }

    // ----------- Perfil (edição) -----------
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
                if (response.status === 401) { window.location.href = 'login.html'; return null; }
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
                reader.onload = e => { previewFoto.src = e.target.result; };
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
            btnRecarregar.addEventListener('click', function () { window.location.reload(); });
        }
    }

    // ----------- Animações (opcional) -----------
    const itens = document.querySelectorAll(".match-item");
    itens.forEach((item, i) => {
        setTimeout(() => item.classList.add("show"), i * 120);
    });
    const chatAtivo = document.querySelector(".chat:not(.d-none)");
    if (chatAtivo) {
        setTimeout(() => chatAtivo.classList.add("show"), 200);
    }
});
