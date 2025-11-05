# 🐳 Guia Completo de Docker

Este guia fornece instruções detalhadas para usar Docker neste projeto.

## 📋 Pré-requisitos

- Docker Desktop instalado (Windows/Mac) ou Docker Engine + Docker Compose (Linux)
- Versão mínima: Docker 20.10+, Docker Compose 2.0+

## 🚀 Início Rápido

### 1. Desenvolvimento

```bash
# Iniciar todos os serviços
docker-compose up --build

# Ou em modo daemon (background)
docker-compose up -d --build
```

**Acesse:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000/api
- MongoDB: localhost:27017

### 2. Parar os serviços

```bash
docker-compose down
```

### 3. Limpar tudo (incluindo volumes)

```bash
docker-compose down -v
```

## 📦 Estrutura dos Dockerfiles

### Backend

- **Dockerfile**: Produção (otimizado, sem dev dependencies)
- **Dockerfile.dev**: Desenvolvimento (com nodemon, hot-reload)

### Frontend

- **Dockerfile**: Produção (build com Vite + Nginx)
- **Dockerfile.dev**: Desenvolvimento (Vite dev server)

## 🔧 Comandos Úteis

### Ver logs

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Executar comandos dentro dos containers

```bash
# Backend
docker-compose exec backend npm install
docker-compose exec backend sh

# Frontend
docker-compose exec frontend npm install
docker-compose exec frontend sh

# MongoDB
docker-compose exec mongodb mongosh
```

### Reconstruir imagens

```bash
# Reconstruir tudo
docker-compose build --no-cache

# Reconstruir serviço específico
docker-compose build --no-cache backend
```

### Reiniciar serviços

```bash
# Todos os serviços
docker-compose restart

# Serviço específico
docker-compose restart backend
```

## 🎯 Modo Produção

### Usar docker-compose.prod.yml

```bash
# Configurar variáveis de ambiente
export JWT_SECRET=your-production-secret-key

# Iniciar
docker-compose -f docker-compose.prod.yml up --build -d

# Parar
docker-compose -f docker-compose.prod.yml down
```

### Diferenças da produção

- Frontend servido via Nginx (porta 80)
- Backend otimizado (sem dev dependencies)
- Health checks configurados
- Restart policy: always
- Volumes persistentes nomeados

## 🔐 Variáveis de Ambiente

### Backend

Crie um arquivo `docker-compose.override.yml` (não versionado):

```yaml
version: '3.8'
services:
  backend:
    environment:
      - JWT_SECRET=your-secret-key
      - JWT_EXPIRE=7d
```

Ou defina no terminal:

```bash
export JWT_SECRET=your-secret-key
docker-compose up
```

### Frontend

```yaml
services:
  frontend:
    environment:
      - VITE_API_URL=http://localhost:5000/api
```

## 📊 Volumes

### Dados do MongoDB

Os dados do MongoDB são persistidos no volume `mongodb_data`:

```bash
# Ver volumes
docker volume ls

# Inspecionar volume
docker volume inspect gastos-mongodb_data

# Remover volume (apaga dados!)
docker volume rm gastos-mongodb_data
```

### Hot-reload (Desenvolvimento)

Os diretórios são montados como volumes para hot-reload:
- `./backend:/app` - Código do backend
- `./frontend:/app` - Código do frontend

## 🐛 Troubleshooting

### Porta já em uso

```bash
# Verificar o que está usando a porta
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000

# Parar container usando a porta
docker-compose down
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs backend

# Verificar status
docker-compose ps

# Reconstruir do zero
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### MongoDB não conecta

```bash
# Verificar se MongoDB está rodando
docker-compose ps mongodb

# Ver logs do MongoDB
docker-compose logs mongodb

# Reiniciar MongoDB
docker-compose restart mongodb
```

### Limpar tudo

```bash
# Parar e remover containers, volumes, imagens
docker-compose down -v --rmi all

# Limpar sistema Docker (cuidado!)
docker system prune -a --volumes
```

## 🔄 Makefile (Atalhos)

Se você tem `make` instalado, use os atalhos:

```bash
make help          # Ver todos os comandos
make up            # Iniciar containers
make down          # Parar containers
make logs          # Ver logs
make build         # Construir imagens
make clean         # Limpar tudo
```

## 📝 Notas Importantes

1. **Primeira execução**: O build pode demorar alguns minutos na primeira vez
2. **Hot-reload**: Funciona automaticamente em desenvolvimento
3. **Dados**: Os dados do MongoDB persistem entre reinicializações
4. **Segurança**: Nunca commite arquivos `.env` ou `docker-compose.override.yml`
5. **Performance**: Em produção, use `docker-compose.prod.yml`

## 🌐 Deploy em Produção

### Opções de Deploy

1. **Railway** - Suporta Docker Compose diretamente
2. **Render** - Upload do docker-compose.yml
3. **DigitalOcean App Platform** - Deploy via GitHub
4. **AWS ECS** - Usa Docker Compose ou ECS Task Definitions
5. **Google Cloud Run** - Deploy container individual

### Exemplo: Railway

1. Conecte seu repositório GitHub
2. Railway detecta automaticamente o `docker-compose.yml`
3. Configure variáveis de ambiente
4. Deploy automático!

### Exemplo: Render

1. Crie um novo Web Service
2. Conecte repositório
3. Use `docker-compose.prod.yml`
4. Configure variáveis de ambiente
5. Deploy!

## 📚 Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)

