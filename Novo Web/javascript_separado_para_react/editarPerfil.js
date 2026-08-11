export function inicializarEditarPerfil() {
const nomeInput = document.getElementById('nome');
    const cidadeInput = document.getElementById('cidade');
    const fotoInput = document.getElementById('fotoPerfil');
    const previewNome = document.getElementById('previewNome');
    const previewCidade = document.getElementById('previewCidade');
    const previewFoto = document.getElementById('previewFoto');
    const previewGeneros = document.getElementById('previewGeneros');
    const formEditarPerfil = document.getElementById('formEditarPerfil');
    const btnRecarregar = document.getElementById('btnRecarregar');
    const generoChips = document.querySelectorAll('#generosSelecao .genero-chip');
    let perfilOriginal = null;

    async function carregarDadosPerfil() {
      try {
        const resposta = await fetch('backend/perfil/dados.php', { headers: { 'Accept': 'application/json' } });

        if (resposta.status === 401) {
          window.location.href = 'login.html';
          return;
        }

        if (!resposta.ok) throw new Error('Falha ao carregar dados do perfil');

        const dados = await resposta.json();
        perfilOriginal = dados;

        nomeInput.value = dados.nome || '';
        cidadeInput.value = dados.cidade || '';
        previewNome.textContent = dados.nome || 'Seu nome';
        previewCidade.textContent = dados.cidade || 'Sua cidade';

        if (dados.foto) {
          previewFoto.src = dados.foto;
        }

        const generosSalvos = Array.isArray(dados.generos) ? dados.generos : [];
        generoChips.forEach(chip => {
          const input = chip.querySelector('input');
          input.checked = generosSalvos.includes(input.value);
        });

        atualizarSelecionados();
      } catch (erro) {
        console.error('Não foi possível carregar o perfil:', erro);
        atualizarSelecionados();
      }
    }

    carregarDadosPerfil();


    function atualizarPreviewGeneros() {
      previewGeneros.innerHTML = '';
      const selecionados = Array.from(generoChips)
        .filter(chip => chip.querySelector('input').checked)
        .map(chip => chip.querySelector('input').value);

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
    }

    function atualizarSelecionados() {
      generoChips.forEach(chip => {
        const input = chip.querySelector('input');
        chip.classList.toggle('selecionado', input.checked);
      });
      atualizarPreviewGeneros();
    }

    nomeInput.addEventListener('input', () => {
      previewNome.textContent = nomeInput.value || 'Seu nome';
    });

    cidadeInput.addEventListener('input', () => {
      previewCidade.textContent = cidadeInput.value || 'Sua cidade';
    });

    let cropper;
    const cropImage = document.getElementById('cropImage');
    const cropModal = new bootstrap.Modal(document.getElementById('cropModal'));
    const confirmCrop = document.getElementById('confirmCrop');

    fotoInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (e) {
        cropImage.src = e.target.result;
        cropModal.show();

        if (cropper) cropper.destroy();

        cropper = new Cropper(cropImage, {
          aspectRatio: 1,
          viewMode: 1,
          autoCrop: true,
          autoCropArea: 1,
          center: true,
          movable: true,
          zoomable: true,
          cropBoxMovable: true,
          cropBoxResizable: true,
          dragMode: 'move'
        });
      };

      reader.readAsDataURL(file);
    });

    confirmCrop.addEventListener('click', function () {
      if (!cropper) return;

      const canvas = cropper.getCroppedCanvas({
        width: 300,
        height: 300
      });

      previewFoto.src = canvas.toDataURL('image/png');

      canvas.toBlob(function (blob) {
        const file = new File([blob], "perfil.png", { type: "image/png" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fotoInput.files = dataTransfer.files;
      });
    });

    generoChips.forEach(chip => {
      const input = chip.querySelector('input');
      chip.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'input') return;
        input.checked = !input.checked;
        atualizarSelecionados();
      });
      input.addEventListener('change', atualizarSelecionados);
    });

    formEditarPerfil.addEventListener('submit', function (event) {
      if (!formEditarPerfil.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
    });

    btnRecarregar.addEventListener('click', function () {
      window.location.reload();
    });

    atualizarSelecionados();
}
