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

let csrfToken = '';
async function carregarCsrf() {
    try {
        const resposta = await fetch('./backend/usuarios/csrf.php', { cache: 'no-store' });
        if (!resposta.ok) throw new Error();
        csrfToken = (await resposta.json()).token || '';
    } catch (_) {
        csrfToken = '';
    }
    return csrfToken;
}

function aplicarCsrfNosFormularios() {
    if (!csrfToken) return;
    document.querySelectorAll('form[method="POST"], form[method="post"]').forEach(form => {
        let campo = form.querySelector('input[name="csrf_token"]');
        if (!campo) {
            campo = document.createElement('input');
            campo.type = 'hidden';
            campo.name = 'csrf_token';
            form.appendChild(campo);
        }
        campo.value = csrfToken;
    });
}

function enviarFormularioProtegido(acao, campos = {}) {
    if (!csrfToken) {
        alert('Não foi possível validar sua sessão. Atualize a página e tente novamente.');
        return;
    }
    const formulario = document.createElement('form');
    formulario.method = 'POST';
    formulario.action = acao;
    Object.entries({ ...campos, csrf_token: csrfToken }).forEach(([nome, valor]) => {
        const campo = document.createElement('input');
        campo.type = 'hidden';
        campo.name = nome;
        campo.value = valor;
        formulario.appendChild(campo);
    });
    document.body.appendChild(formulario);
    formulario.submit();
}

const autenticacaoPronta = verificarAutenticacao();
const csrfPronto = carregarCsrf();

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

async function atualizarNavbar() {
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
        if (elPerfil) {
            elPerfil.innerHTML = '<img class="profile-nav-avatar" src="./Imagens/default-profile.jpg" alt="Abrir meu perfil">';
            const avatar = elPerfil.querySelector('.profile-nav-avatar');
            try {
                const resposta = await fetch('./backend/perfil/dados.php', {
                    headers: { 'Accept': 'application/json' },
                    cache: 'no-store'
                });
                if (!resposta.ok) throw new Error();
                const perfil = await resposta.json();
                if (avatar && perfil.idPerfis) {
                    avatar.onerror = () => {
                        avatar.onerror = null;
                        avatar.src = './Imagens/default-profile.jpg';
                    };
                    avatar.src = `./backend/imagens/publica.php?tipo=perfil&id=${encodeURIComponent(perfil.idPerfis)}`;
                }
            } catch (_) {
                // Mantém o avatar padrão quando a foto não puder ser carregada.
            }
        }
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
    const layout = document.querySelector('.chat-layout');
    const botaoVoltar = document.getElementById('chatBack');
    const botaoOpcoes = document.getElementById('chatOptionsButton');
    const botaoExcluir = document.getElementById('deleteConversationButton');
    if (!lista || !mensagensEl || !input || !botao) return;
    let contatoAtual = null;
    const formatarHora = data => data ? new Date(data.replace(' ', 'T')).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '';

    async function abrirContato(contato, item) {
        contatoAtual = contato.id;
        document.querySelectorAll('.match-item').forEach(el => el.classList.remove('active'));
        if (item) item.classList.add('active');
        if (layout) layout.classList.add('chat-open');
        document.getElementById('chatUserName').textContent = contato.nome;
        document.getElementById('chatAvatar').src = contato.foto;
        input.disabled = botao.disabled = false;
        if (botaoOpcoes) botaoOpcoes.disabled = false;
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
            lista.innerHTML = contatos.length ? '' : '<div class="p-3 text-muted">A conversa será liberada quando vocês curtirem livros um do outro.</div>';
            contatos.forEach(contato => {
                const item = document.createElement('div');
                item.className = 'match-item';
                item.innerHTML = `<img src="${contato.foto}" class="match-cover" alt=""><div class="match-info"><strong>${escaparHtml(contato.nome)}</strong><span class="last-msg">${escaparHtml(contato.ultimaMensagem || 'Novo match')}</span><span class="msg-time">${formatarHora(contato.ultimaData)}</span></div>`;
                item.addEventListener('click', () => abrirContato(contato, item));
                lista.appendChild(item);
            });
            if (contatos.length && !window.matchMedia('(max-width: 768px)').matches) {
                abrirContato(contatos[0], lista.querySelector('.match-item'));
            }
        } catch (_) {
            lista.innerHTML = '<div class="p-3 text-danger">Não foi possível carregar as conversas.</div>';
        }
    }

    async function enviarMensagem() {
        const conteudo = input.value.trim();
        if (!conteudo || !contatoAtual) return;
        botao.disabled = true;
        const dados = new URLSearchParams({ acao: 'enviar', contato_id: contatoAtual, conteudo });
        const resposta = await fetch('./backend/conversas/conversas.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-Token': csrfToken }, body: dados });
        botao.disabled = false;
        if (!resposta.ok) return alert('Não foi possível enviar a mensagem.');
        input.value = '';
        const item = document.querySelector('.match-item.active');
        await abrirContato({ id: contatoAtual, nome: document.getElementById('chatUserName').textContent, foto: document.getElementById('chatAvatar').src }, item);
        input.focus();
    }

    async function excluirConversa() {
        if (!contatoAtual) return;
        const nomeContato = document.getElementById('chatUserName').textContent;
        if (!confirm(`Excluir a conversa com ${nomeContato}? O histórico deixará de aparecer para os dois usuários.`)) return;

        botaoExcluir.disabled = true;
        try {
            const dados = new URLSearchParams({ acao: 'excluir', contato_id: contatoAtual });
            const resposta = await fetch('./backend/conversas/conversas.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-Token': csrfToken },
                body: dados
            });
            if (!resposta.ok) throw new Error();

            contatoAtual = null;
            document.getElementById('chatUserName').textContent = 'Selecione uma conversa';
            document.getElementById('chatAvatar').src = './Imagens/default-profile.jpg';
            mensagensEl.innerHTML = '<div class="text-muted text-center p-4">Conversa excluída.</div>';
            input.value = '';
            input.disabled = botao.disabled = true;
            if (botaoOpcoes) botaoOpcoes.disabled = true;
            if (layout) layout.classList.remove('chat-open');
            await carregarContatos();
        } catch (_) {
            alert('Não foi possível excluir a conversa. Tente novamente.');
        } finally {
            botaoExcluir.disabled = false;
        }
    }
    botao.addEventListener('click', enviarMensagem);
    if (botaoExcluir) botaoExcluir.addEventListener('click', excluirConversa);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); enviarMensagem(); } });
    if (botaoVoltar) {
        botaoVoltar.addEventListener('click', () => {
            if (layout) layout.classList.remove('chat-open');
        });
    }
    carregarContatos();
}

function iniciarBuscaPerfis() {
    const collapse = document.querySelector('.navbar-collapse');
    if (!collapse || collapse.querySelector('.profile-search')) return;
    const menuConta = collapse.querySelector(':scope > .navbar-nav:last-of-type');
    if (!menuConta) return;

    const busca = document.createElement('form');
    busca.className = 'profile-search';
    busca.setAttribute('role', 'search');
    busca.innerHTML = `
        <label class="visually-hidden" for="profileSearchInput">Pesquisar perfis</label>
        <div class="profile-search-control">
            <i class="bi bi-search"></i>
            <input id="profileSearchInput" type="search" autocomplete="off" maxlength="50" placeholder="Pesquisar perfis..." aria-label="Pesquisar perfis" aria-expanded="false" aria-controls="profileSearchResults">
            <span class="profile-search-spinner spinner-border spinner-border-sm" hidden></span>
        </div>
        <div id="profileSearchResults" class="profile-search-results" hidden></div>`;
    collapse.insertBefore(busca, menuConta);

    const input = busca.querySelector('input');
    const resultados = busca.querySelector('.profile-search-results');
    const spinner = busca.querySelector('.profile-search-spinner');
    let temporizador;
    let requisicao;

    function redirecionarParaLogin() {
        const retorno = encodeURIComponent(
            window.location.pathname.split('/').pop() + window.location.search + window.location.hash
        );
        window.location.assign(`login.html?retorno=${retorno}`);
    }

    async function usuarioPodePesquisar() {
        try {
            const resposta = await fetch('./backend/usuarios/sessao.php', {
                headers: { 'Accept': 'application/json' },
                cache: 'no-store'
            });
            if (!resposta.ok) throw new Error();
            const dados = await resposta.json();
            if (!dados.autenticado) throw new Error();
            sessionStorage.setItem('logado', 'true');
            return true;
        } catch (_) {
            sessionStorage.removeItem('logado');
            redirecionarParaLogin();
            return false;
        }
    }

    function fechar() {
        resultados.hidden = true;
        input.setAttribute('aria-expanded', 'false');
    }

    async function pesquisar() {
        const termo = input.value.trim();
        if (termo.length < 2) {
            resultados.innerHTML = '<div class="profile-search-hint">Digite pelo menos dois caracteres.</div>';
            resultados.hidden = termo.length === 0;
            input.setAttribute('aria-expanded', String(termo.length > 0));
            return;
        }
        if (!(await usuarioPodePesquisar())) return;
        requisicao?.abort();
        requisicao = new AbortController();
        spinner.hidden = false;
        try {
            const resposta = await fetch(`./backend/perfis/publico.php?acao=buscar&q=${encodeURIComponent(termo)}`, { signal: requisicao.signal });
            if (resposta.status === 401) {
                redirecionarParaLogin();
                return;
            }
            if (!resposta.ok) throw new Error();
            const perfis = await resposta.json();
            resultados.innerHTML = perfis.length
                ? perfis.map(perfil => `<a class="profile-search-result" href="perfilPublico.html?id=${perfil.id}"><img src="${perfil.foto}" alt=""><span><strong>${escaparHtml(perfil.nome)}</strong><small><i class="bi bi-geo-alt"></i> ${escaparHtml(perfil.cidade || 'Cidade não informada')}</small></span><i class="bi bi-chevron-right"></i></a>`).join('')
                : '<div class="profile-search-hint">Nenhum perfil encontrado.</div>';
            resultados.hidden = false;
            input.setAttribute('aria-expanded', 'true');
        } catch (erro) {
            if (erro.name !== 'AbortError') {
                resultados.innerHTML = '<div class="profile-search-hint text-danger">Não foi possível pesquisar agora.</div>';
                resultados.hidden = false;
            }
        } finally {
            spinner.hidden = true;
        }
    }

    input.addEventListener('input', () => {
        clearTimeout(temporizador);
        temporizador = setTimeout(pesquisar, 250);
    });
    input.addEventListener('focus', () => {
        if (sessionStorage.getItem('logado') !== 'true') {
            usuarioPodePesquisar();
            return;
        }
        if (resultados.innerHTML) resultados.hidden = false;
    });
    busca.addEventListener('submit', event => {
        event.preventDefault();
        const primeiro = resultados.querySelector('a');
        if (primeiro) window.location.href = primeiro.href;
        else pesquisar();
    });
    document.addEventListener('click', event => {
        if (!busca.contains(event.target)) fechar();
    });
}

async function carregarPerfilPublico() {
    const conteudo = document.getElementById('publicProfileContent');
    if (!conteudo) return;
    const carregando = document.getElementById('publicProfileLoading');
    const erro = document.getElementById('publicProfileError');
    const perfilId = new URLSearchParams(window.location.search).get('id');
    try {
        if (!/^\d+$/.test(perfilId || '')) throw new Error();
        const resposta = await fetch(`./backend/perfis/publico.php?acao=detalhes&id=${perfilId}`);
        if (!resposta.ok) throw new Error();
        const dados = await resposta.json();
        const perfil = dados.perfil;
        document.title = `${perfil.nome} | Read & Swap`;
        document.getElementById('publicProfilePhoto').src = perfil.foto;
        document.getElementById('publicProfilePhoto').alt = `Foto de ${perfil.nome}`;
        document.getElementById('publicProfileName').textContent = perfil.nome;
        document.getElementById('publicProfileCity').innerHTML = `<i class="bi bi-geo-alt-fill"></i> ${escaparHtml(perfil.cidade || 'Cidade não informada')}`;
        const plano = document.getElementById('publicProfilePlan');
        plano.className = `membership-status ${perfil.premium ? 'is-premium' : 'is-free'}`;
        plano.innerHTML = perfil.premium ? '<i class="bi bi-patch-check-fill"></i> Perfil Premium' : '<i class="bi bi-person-check-fill"></i> Plano gratuito';
        document.getElementById('publicBooksOwner').textContent = perfil.nome;
        document.getElementById('publicBooksCount').textContent = `${dados.livros.length} ${dados.livros.length === 1 ? 'livro' : 'livros'}`;
        const grade = document.getElementById('publicBooksGrid');
        grade.innerHTML = dados.livros.length ? dados.livros.map(livro => `
            <article class="public-book-card">
                <img src="${livro.foto}" alt="Capa de ${escaparHtml(livro.nome)}">
                <div><span>${escaparHtml(livro.genero || 'Sem gênero')}</span><h3>${escaparHtml(livro.nome)}</h3><p>${escaparHtml(livro.autor || 'Autor não informado')}</p><small><i class="bi bi-book-half"></i> ${escaparHtml(livro.estado || 'Estado não informado')}</small></div>
            </article>`).join('') : '<div class="public-books-empty"><i class="bi bi-bookshelf"></i><h3>Nenhum livro disponível</h3><p>Este usuário ainda não possui livros disponíveis para troca.</p></div>';
        carregando.classList.add('d-none');
        conteudo.classList.remove('d-none');
    } catch (_) {
        carregando.classList.add('d-none');
        erro.classList.remove('d-none');
    }
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
    await csrfPronto;
    aplicarCsrfNosFormularios();
    document.addEventListener('submit', event => {
        if (event.target.matches('form[method="POST"], form[method="post"]') && !csrfToken) {
            event.preventDefault();
            alert('Não foi possível validar sua sessão. Atualize a página e tente novamente.');
        }
    });
    console.log('javascript.js carregado');

    
    atualizarNavbar();
    iniciarBuscaPerfis();
    carregarPerfilPublico();

   
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
            enviarFormularioProtegido('backend/usuarios/logout.php');
        });
    }
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            const confirmacao = confirm('Tem certeza que deseja excluir sua conta? Essa ação NÃO pode ser desfeita.');
            if (confirmacao) enviarFormularioProtegido('backend/usuarios/excluir.php');
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

        function mostrarAvisoMatch() {
            document.querySelector('.match-toast')?.remove();
            const aviso = document.createElement('div');
            aviso.className = 'match-toast';
            aviso.setAttribute('role', 'status');
            aviso.innerHTML = '<i class="bi bi-chat-heart-fill"></i><div><strong>Deu match!</strong><span>Vocês gostaram de livros um do outro.</span></div><a href="matches.html">Conversar</a>';
            document.body.appendChild(aviso);
            requestAnimationFrame(() => aviso.classList.add('show'));
            setTimeout(() => aviso.remove(), 6000);
        }

        function renderDetalhes(livro) {
       
            detalhesConteudo.innerHTML = `
                <div class="swap-genres">${livro.generos.map(g => `<span class="swap-genre-chip">${escaparHtml(g)}</span>`).join('')}</div>
                <p class="mt-2 mb-0"><strong>Dono:</strong> ${escaparHtml(livro.dono)}</p>
            `;

          
            const generosHtml = livro.generos.map(g => `
                <div class="genero-item">
                    <i class="bi bi-bookmark-fill"></i>
                    <span>${escaparHtml(g)}</span>
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
                const ownerLabel = ownerPanel.querySelector('span');
                if (ownerLabel) ownerLabel.textContent = livro.interesseRecebido ? 'Curtiu um livro seu' : 'Livro de';
                ownerPanel.classList.toggle('has-interest', Boolean(livro.interesseRecebido));
                ownerPanel.classList.remove('owner-exit-left', 'owner-exit-right', 'owner-enter');
                ownerPanel.hidden = false;
                void ownerPanel.offsetWidth;
                ownerPanel.classList.add('owner-enter');
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
                const resposta = await fetch('./backend/swaps/avaliar.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-CSRF-Token': csrfToken }, body: dados });
                if (!resposta.ok) throw new Error();
                const resultado = await resposta.json();
                if (resultado.match) mostrarAvisoMatch();
            } catch (_) {
                btnCurtir.disabled = false;
                btnRecusar.disabled = false;
                alert('Não foi possível registrar sua escolha.');
                return;
            }
            if (ownerPanel && !ownerPanel.hidden) {
                ownerPanel.classList.remove('owner-enter', 'owner-exit-left', 'owner-exit-right');
                void ownerPanel.offsetWidth;
                ownerPanel.classList.add(direcao === 'like' ? 'owner-exit-right' : 'owner-exit-left');
            }
            cardContainer.classList.add(direcao === "like" ? "slide-out-right" : "slide-out-left");
            setTimeout(() => {
                index++;
                cardContainer.classList.remove("slide-out-right", "slide-out-left");
                if (index >= livros.length) {
                    if (ownerPanel) {
                        ownerPanel.hidden = true;
                        ownerPanel.classList.remove('owner-exit-left', 'owner-exit-right', 'owner-enter');
                    }
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
                            <span>${escaparHtml(g)}</span>
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
                                        <form method="POST" action="backend/livros/trocados.php" class="library-action-form" onsubmit="return confirm('${quest}')"><input type="hidden" name="id" value="${livro.idLivrosADMs}"><input type="hidden" name="csrf_token" value="${escaparHtml(csrfToken)}"><button type="submit" class="btn btn-sm btn-danger library-action-btn"><i class="bi bi-arrow-repeat"></i><span>${troca}</span></button></form>
                                        <form method="POST" action="backend/livros/excluir.php" class="library-action-form" onsubmit="return confirm('Remover este livro?')"><input type="hidden" name="id" value="${livro.idLivrosADMs}"><input type="hidden" name="csrf_token" value="${escaparHtml(csrfToken)}"><button type="submit" class="btn btn-sm btn-outline-danger library-action-btn library-remove-btn"><i class="bi bi-trash3"></i><span>Remover</span></button></form>
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
