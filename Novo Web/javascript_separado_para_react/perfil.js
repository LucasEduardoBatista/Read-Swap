export async function inicializarPerfil() {

  const fotoPerfil = document.querySelector('.perfil-foto');
  const nomePerfil = document.querySelector('.perfil-header h3');
  const cidadePerfil = document.querySelector('.perfil-header p.text-muted');
  const statusEl = document.getElementById('statusAssinatura');
  const botaoPremium = document.getElementById('botaoPremium');
  const listaGeneros = document.getElementById('listaGeneros');

  try {
    const resposta = await fetch('backend/perfil/dados.php', { headers: { 'Accept': 'application/json' } });

    if (resposta.status === 401) {
      window.location.href = 'login.html';
      return;
    }

    if (!resposta.ok) {
      throw new Error('Falha ao carregar perfil');
    }

    const dados = await resposta.json();

    if (fotoPerfil && dados.foto) {
      fotoPerfil.src = dados.foto;
    }

    if (nomePerfil) {
      nomePerfil.textContent = dados.nome || 'Usuário';
    }

    if (cidadePerfil) {
      cidadePerfil.innerHTML = '<i class="bi bi-geo-alt"></i>' + (dados.cidade || 'Cidade não informada');
    }

    if (statusEl) {
      if (Number(dados.premium) === 1) {
        statusEl.textContent = 'Ativa (Usuário Premium)';
        statusEl.style.color = 'green';
        if (botaoPremium) botaoPremium.style.display = 'none';
      } else {
        statusEl.textContent = 'Nenhuma assinatura ativa';
        statusEl.style.color = 'red';
        if (botaoPremium) botaoPremium.style.display = 'inline-block';
      }
    }

    if (botaoPremium) {
      botaoPremium.addEventListener('click', () => {
        window.location.href = 'premium.html';
      });
    }

    if (listaGeneros) {
      listaGeneros.innerHTML = '';
      const generos = Array.isArray(dados.generos) ? dados.generos : [];

      if (generos.length === 0) {
        const vazio = document.createElement('span');
        vazio.className = 'text-muted';
        vazio.textContent = 'Nenhum gênero definido';
        listaGeneros.appendChild(vazio);
      } else {
        generos.forEach(genero => {
          const span = document.createElement('span');
          span.classList.add('genero-tag');
          span.textContent = genero;
          listaGeneros.appendChild(span);
        });
      }
    }
  } catch (erro) {
    console.error(erro);
    if (statusEl) {
      statusEl.textContent = 'Nenhuma assinatura ativa';
      statusEl.style.color = 'red';
    }
  }
}
