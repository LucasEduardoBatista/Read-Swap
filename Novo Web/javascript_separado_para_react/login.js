import { mostrarFeedbackInvalido } from './common.js';

export function inicializarLogin() {
  const senhaInput = document.getElementById('senha');
  const toggleBtn = document.getElementById('toggleSenha');
  const icone = document.getElementById('iconeSenha');

  if (toggleBtn && senhaInput && icone) {
    toggleBtn.addEventListener('click', () => {
      const tipoAtual = senhaInput.getAttribute('type');
      senhaInput.setAttribute(
        'type',
        tipoAtual === 'password' ? 'text' : 'password'
      );
      icone.classList.toggle('bi-eye');
      icone.classList.toggle('bi-eye-slash');
    });
  }

  const formLogin = document.getElementById('needs-validation');

  if (formLogin) {
    formLogin.addEventListener('submit', event => {
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
}
