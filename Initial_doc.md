# Sistema de Cálculo de Gastos para Microempreendedores

Sistema completo para gestão financeira de microempreendedores, permitindo controle de despesas, receitas e geração de relatórios detalhados.

## 🚀 Tecnologias

### Backend
- **Node.js** com **Express.js**
- **MongoDB** com **Mongoose**
- **JWT** para autenticação
- **bcryptjs** para criptografia de senhas

### Frontend
- **React.js** com **Vite**
- **TailwindCSS** para estilização
- **Recharts** para gráficos
- **React Router** para navegação
- **Axios** para requisições HTTP

## 📋 Funcionalidades

### ✅ Implementadas
- ✅ Cadastro e autenticação de usuários
- ✅ Gestão de despesas (fixas e variáveis)
- ✅ Gestão de receitas
- ✅ Cálculo de lucro líquido mensal
- ✅ Cálculo de margem de lucro
- ✅ Relatórios e gráficos
- ✅ Sugestões automáticas de economia
- ✅ Edição de perfil (nome, CNPJ, ramo de atividade)
- ✅ Dashboard com resumo financeiro
- ✅ Interface responsiva e moderna

## 🛠️ Instalação e Configuração

### Pré-requisitos

**Opção 1: Instalação Local**
- Node.js (v18 ou superior)
- MongoDB (local ou MongoDB Atlas)

**Opção 2: Docker (Recomendado)**
- Docker (v20 ou superior)
- Docker Compose (v2 ou superior)

### Passo 1: Clonar e instalar dependências

```bash
# Instalar dependências do projeto raiz
npm install

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### Passo 2: Configurar variáveis de ambiente

No diretório `backend`, crie um arquivo `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gastos-microemp
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Para MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/gastos-microemp
```

No diretório `frontend`, crie um arquivo `.env` (opcional):

```env
VITE_API_URL=http://localhost:5000/api
```

### Passo 3: Iniciar o servidor MongoDB

Se estiver usando MongoDB local:
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### Passo 4: Iniciar os servidores

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

O backend estará rodando em `http://localhost:5000`  
O frontend estará rodando em `http://localhost:3000`

## 🐳 Instalação com Docker (Recomendado)

### Início Rápido

A forma mais fácil de executar o projeto é usando Docker Compose:

```bash
# Construir e iniciar todos os containers
docker-compose up --build

# Ou em modo daemon (background)
docker-compose up -d --build
```

Isso irá:
- ✅ Iniciar MongoDB na porta 27017
- ✅ Iniciar Backend na porta 5000
- ✅ Iniciar Frontend na porta 3000

**Acesse:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- MongoDB: localhost:27017

### Comandos Úteis

```bash
# Parar todos os containers
docker-compose down

# Parar e remover volumes (limpar dados do MongoDB)
docker-compose down -v

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Reconstruir containers após mudanças
docker-compose up --build

# Usar Makefile (se disponível)
make help    # Ver todos os comandos
make up      # Iniciar containers
make logs    # Ver logs
```

### Produção com Docker

Para produção, use o arquivo `docker-compose.prod.yml`:

```bash
# Configurar variáveis de ambiente
export JWT_SECRET=your-production-secret-key
export JWT_EXPIRE=7d

# Iniciar em modo produção
docker-compose -f docker-compose.prod.yml up --build -d
```

**Diferenças da versão de produção:**
- Frontend é servido via Nginx (porta 80)
- Backend otimizado (sem dev dependencies)
- Health checks configurados
- Restart automático sempre

### Documentação Completa

Para mais detalhes sobre Docker, consulte o arquivo **[DOCKER.md](DOCKER.md)** com:
- Guia completo de uso
- Troubleshooting
- Configurações avançadas
- Deploy em produção

## 📚 Estrutura do Projeto

```
uni_project/
├── backend/
│   ├── models/          # Modelos MongoDB (User, Expense, Revenue)
│   ├── routes/          # Rotas da API
│   ├── middleware/      # Middleware de autenticação
│   ├── utils/           # Utilitários (generateToken)
│   └── server.js        # Arquivo principal do servidor
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── context/     # Context API (AuthContext)
│   │   ├── pages/       # Páginas da aplicação
│   │   ├── App.jsx      # Componente principal
│   │   └── main.jsx     # Entry point
│   └── package.json
└── README.md
```

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

## 🧪 Testes

Para executar os testes (quando implementados):

```bash
cd backend
npm test
```

## 📦 Deploy

### Deploy com Docker

O projeto está pronto para deploy em qualquer plataforma que suporte Docker:

**Opções de Deploy:**
- **Railway** - Suporta Docker Compose
- **Render** - Suporta Docker
- **DigitalOcean App Platform** - Suporta Docker
- **AWS ECS/Fargate** - Suporta Docker
- **Google Cloud Run** - Suporta Docker
- **Azure Container Instances** - Suporta Docker

**Para deploy em produção:**
1. Configure as variáveis de ambiente no seu provedor
2. Use `docker-compose.prod.yml` ou crie um Dockerfile específico
3. Configure o domínio e certificados SSL

### Deploy Tradicional

**Backend:**
- **Render**
- **Railway**
- **Heroku**
- **Vercel** (serverless)

**Frontend:**
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Autenticação JWT implementada
- Validação de dados com express-validator
- CORS configurado

## 📝 Notas de Desenvolvimento

### Categorias de Despesas
- aluguel
- fornecedores
- impostos
- salarios
- marketing
- equipamentos
- utilitarios
- transportes
- outros

### Categorias de Receitas
- vendas
- servicos
- produtos
- consultoria
- outros

## 🎯 Próximas Melhorias

- [ ] Autenticação com Google OAuth
- [ ] Exportação de relatórios em PDF/Excel
- [ ] Notificações por email
- [ ] Dashboard com mais métricas
- [ ] Testes automatizados (Jest/Cypress)
- [ ] Modo escuro
- [ ] App mobile (React Native)

## 📄 Licença

MIT

## 👤 Autor

Desenvolvido como projeto universitário.

