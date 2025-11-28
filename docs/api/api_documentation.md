# API

## 🔌 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login

### Usuário
- `GET /api/user/profile` - Obter perfil (requer autenticação)
- `PUT /api/user/profile` - Atualizar perfil (requer autenticação)

### Despesas
- `GET /api/expenses` - Listar despesas (requer autenticação)
- `POST /api/expenses` - Criar despesa (requer autenticação)
- `PUT /api/expenses/:id` - Atualizar despesa (requer autenticação)
- `DELETE /api/expenses/:id` - Deletar despesa (requer autenticação)

### Receitas
- `GET /api/revenues` - Listar receitas (requer autenticação)
- `POST /api/revenues` - Criar receita (requer autenticação)
- `PUT /api/revenues/:id` - Atualizar receita (requer autenticação)
- `DELETE /api/revenues/:id` - Deletar receita (requer autenticação)

### Relatórios
- `GET /api/reports/monthly?month=X&year=Y` - Relatório mensal (requer autenticação)
- `GET /api/reports/overview` - Overview dos últimos 6 meses (requer autenticação)
