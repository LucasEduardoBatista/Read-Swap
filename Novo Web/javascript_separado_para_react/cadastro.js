import { mostrarFeedbackInvalido } from './common.js';

export function inicializarCadastro() {
  const formCadastro = document.getElementById('form-cadastro');

  if (!formCadastro) return;

  formCadastro.addEventListener('submit', event => {
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

  const confirmaSenha = document.getElementById('confirmaSenha');

  if (confirmaSenha) {
    confirmaSenha.addEventListener('input', function () {
      this.setCustomValidity('');
      this.classList.remove('is-invalid');
    });
  }
}
