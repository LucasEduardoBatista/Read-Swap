export function inicializarConfiguracoes() {
  const logoutBtn = document.getElementById('logoutBtn');
  const deleteAccountBtn = document.getElementById('deleteAccountBtn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = 'backend/usuarios/logout.php';
    });
  }

  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', () => {
      const confirmacao = confirm(
        'Tem certeza que deseja excluir sua conta? Essa ação NÃO pode ser desfeita.'
      );

      if (confirmacao) {
        window.location.href = 'backend/usuarios/excluir.php';
      }
    });
  }
}
