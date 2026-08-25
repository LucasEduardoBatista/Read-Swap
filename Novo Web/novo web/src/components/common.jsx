

export function ToggleDarkMode() {
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

export function AtualizarNavbar() {
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

export function InicializarTema() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('darkModeBtn');
    if (btn) btn.innerHTML = '<i class="bi bi-brightness-high-fill"></i>';
  }
}

export function EscaparHtml(texto) {
  return String(texto ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function MostrarFeedbackInvalido(form) {
  const invalidElements = form.querySelectorAll(
    '.form-control:invalid, .form-check-input:invalid'
  );

  invalidElements.forEach(input => {
    const feedback = input.parentNode.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.classList.remove('animated');
      void feedback.offsetWidth;
      feedback.classList.add('animated');
    }
  });
}

export function InicializarComuns() {
  AtualizarNavbar();
  InicializarTema();
}
