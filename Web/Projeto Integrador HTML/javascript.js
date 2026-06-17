/* ==============================================================
   FUNÇÕES GLOBAIS
   ============================================================== */

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


function iniciarChat() {
    // 1. Restaurar mensagens salvas
    document.querySelectorAll('.chat-panel').forEach(chatPanel => {
        const chatId = chatPanel.id;
        const messagesContainer = chatPanel.querySelector('.messages');
        if (!messagesContainer) return;

        const saved = localStorage.getItem(`chatMessages_${chatId}`);
        if (saved) {
            try {
                const msgs = JSON.parse(saved);
                if (Array.isArray(msgs) && msgs.length > 0) {
                    messagesContainer.innerHTML = '';
                    msgs.forEach(msg => {
                        const div = document.createElement('div');
                        div.className = `message ${msg.tipo}`;
                        div.innerHTML = `${msg.texto} <span class="msg-time">${msg.hora}</span>`;
                        messagesContainer.appendChild(div);
                    });
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            } catch (e) { /* ignora erro */ }
        }
    });

    // 2. Configurar eventos de envio
    document.querySelectorAll('.chat-panel').forEach(chatPanel => {
        const chatId = chatPanel.id;
        const input = chatPanel.querySelector('.chat-input input');
        const btn = chatPanel.querySelector('.chat-input .send-btn');
        const messagesContainer = chatPanel.querySelector('.messages');
        if (!input || !btn || !messagesContainer) return;

        function enviarMensagem() {
            const texto = input.value.trim();
            if (texto === '') return;

            const agora = new Date();
            const hora = String(agora.getHours()).padStart(2, '0') + ':' + String(agora.getMinutes()).padStart(2, '0');

            const div = document.createElement('div');
            div.className = 'message sent';
            div.innerHTML = `${texto} <span class="msg-time">${hora}</span>`;
            messagesContainer.appendChild(div);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            const chave = `chatMessages_${chatId}`;
            let msgs = JSON.parse(localStorage.getItem(chave) || '[]');
            msgs.push({ tipo: 'sent', texto: texto, hora: hora });
            localStorage.setItem(chave, JSON.stringify(msgs));

            input.value = '';
            input.focus();
        }

        btn.addEventListener('click', enviarMensagem);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                enviarMensagem();
            }
        });
    });

    // 3. Troca de conversa via clique nos itens
    document.querySelectorAll('.match-item').forEach(item => {
        item.addEventListener('click', function() {
            const chatId = this.dataset.chat;
            if (!chatId) return;

            document.querySelectorAll('.match-item').forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.chat-panel').forEach(c => c.classList.add('d-none'));
            const target = document.getElementById(chatId);
            if (target) {
                target.classList.remove('d-none');
                const msgs = target.querySelector('.messages');
                if (msgs) msgs.scrollTop = msgs.scrollHeight;
            }
        });
    });
}

/* ==============================================================
   INICIALIZAÇÃO GERAL (DOMContentLoaded)
   ============================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('javascript.js carregado');

    // Atualizar navbar
    atualizarNavbar();

    // Aplicar tema escuro salvo
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        const btn = document.getElementById('darkModeBtn');
        if (btn) btn.innerHTML = '<i class="bi bi-brightness-high-fill"></i>';
    }

    // Iniciar chat
    iniciarChat();

    // ----------- Mostrar/ocultar senha -----------
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

    // ----------- Login -----------
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

    // ----------- Cadastro -----------
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

    // ----------- Logout / exclusão -----------
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

    if (cardImg && cardTitle && cardDesc && detalhesConteudo && detalhesLateral && btnDetalhes && btnCurtir && btnRecusar) {
        const livros = [
            { titulo: "A Rainha Vermelha", autor: "Victoria Aveyard", img: "./Imagens/livro1.jpg", generos: ["Fantasia", "Romance", "Aventura"], distancia: "2 Km de você" },
            { titulo: "1984", autor: "George Orwell", img: "./Imagens/livro2.jpg", generos: ["Distopia", "Ficção Científica"], distancia: "4 Km de você" },
            { titulo: "Dom Casmurro", autor: "Machado de Assis", img: "./Imagens/livro3.jpg", generos: ["Clássicos", "Drama"], distancia: "1,5 Km de você" }
        ];
        let index = 0;
        let detalhesAbertos = false;

        function renderDetalhes(livro) {
            // Gêneros no card (se quiser manter, mas vou deixar apenas no lateral)
            // Para não duplicar, vou preencher o detalhesConteudo com info simples
            detalhesConteudo.innerHTML = `
                <div class="swap-genres">${livro.generos.map(g => `<span class="swap-genre-chip">${g}</span>`).join('')}</div>
                <p class="mt-2 mb-0">${livro.distancia}</p>
            `;

            // Preencher o painel lateral com os gêneros em formato lista
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

            // Se os detalhes estiverem abertos, fechamos automaticamente ao mudar de livro
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

        // Toggle dos detalhes laterais
        btnDetalhes.addEventListener('click', function(e) {
            e.stopPropagation();
            detalhesAbertos = !detalhesAbertos;
            if (detalhesAbertos) {
                detalhesLateral.classList.add('visivel');
                // Atualiza o conteúdo (caso tenha mudado)
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

        // Fechar detalhes ao clicar fora (opcional)
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

    // ----------- Gêneros favoritos -----------
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

    // ----------- Biblioteca -----------
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