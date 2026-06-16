# Backend PHP / MySQL

## Como executar
1. Coloque a pasta do projeto em um servidor PHP.
2. Abra o PHP com:
   ```bash
   php -S localhost:8000
   ```
   ou use o Apache do XAMPP.
3. Importe `backend/database.sql` no banco MySQL.
4. Ajuste a conexão em `backend/includes/config.php` se necessário.

## Credenciais atuais do banco
- Host: `143.106.241.4`
- Usuário: `cl204224`
- Banco: `cl204224`

## Tabelas usadas
- `PerfisADMs`
- `LivrosADMs`
- `conversasADMs`
- `ReadSwapADMs`

## Observações
- `Status = 0` significa conta ativa.
- `Status = 1` significa conta inativa.
- `Statuscvs = 0` significa conversa desbloqueada.
- `Statuscvs = 1` significa conversa bloqueada.

## Arquivos principais
- `backend/usuarios/cadastro.php`
- `backend/usuarios/login.php`
- `backend/usuarios/logout.php`
- `backend/usuarios/excluir.php`
- `backend/perfil/atualizar.php`
- `backend/perfil/dados.php`
- `backend/livros/salvar.php`
- `backend/livros/listar.php`
- `backend/livros/excluir.php`
