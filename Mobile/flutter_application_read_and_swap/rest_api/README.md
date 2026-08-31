# Read&Swap REST API

API exclusiva do aplicativo Flutter. Não reutiliza endpoints nem sessões do site.

A API lê apenas as credenciais locais já configuradas em `Web/.../backend/includes/config.local.php`.
Como alternativa, defina `READSWAP_DB_HOST`, `READSWAP_DB_USER`, `READSWAP_DB_PASSWORD`, `READSWAP_DB_NAME` e opcionalmente `READSWAP_DB_PORT`.

```powershell
php -S 0.0.0.0:8080 -t rest_api rest_api/router.php
```

Rotas: `GET /health`, `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET|PUT /me`, `GET|POST /books`, `PUT|DELETE /books/{id}`, `GET|POST /swaps`, `GET /matches` e `GET|POST /conversations/{contato}`.
