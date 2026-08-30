# Backend PHP / MySQL

## Como executar
1. Coloque a pasta do projeto em um servidor PHP.
2. Abra o PHP com:
   ```bash
   php -S localhost:8000
   ```
   ou use o Apache do XAMPP.
3. Importe `backend/database.sql` no banco MySQL.
   Em um banco que já possui as tabelas antigas, execute também `backend/migration_swaps_conversas.sql` uma única vez.
   Para consolidar as mensagens antigas em JSON, execute `php backend/migrar_conversas_json.php`. O script mantém `conversasADMs_backup_json` como backup.
4. Copie `backend/includes/config.local.example.php` para `backend/includes/config.local.php` e preencha as credenciais. Esse arquivo é ignorado pelo Git. Como alternativa, use as variáveis `READSWAP_DB_HOST`, `READSWAP_DB_USER`, `READSWAP_DB_PASSWORD`, `READSWAP_DB_NAME` e `READSWAP_DB_PORT`.

## Tabelas usadas
- `PerfisADMs`
- `LivrosADMs`
- `conversasADMs`
- `SwapsADMs`
- `ReadSwapADMs`

## Observações
- `Status = 0` significa conta ativa.
- `Status = 1` significa conta inativa.
- `Statuscvs = 0` significa conversa desbloqueada.
- `Statuscvs = 1` significa conversa bloqueada.
- `conversasADMs` possui uma linha por par de usuários; `conteudo` guarda um array JSON com remetente, texto e data de cada mensagem.

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
