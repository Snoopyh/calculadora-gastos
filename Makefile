.PHONY: help build up down logs restart clean

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Constrói as imagens Docker
	docker-compose build

up: ## Inicia os containers em modo desenvolvimento
	docker-compose up -d

up-build: ## Constrói e inicia os containers
	docker-compose up --build -d

down: ## Para os containers
	docker-compose down

down-volumes: ## Para os containers e remove volumes
	docker-compose down -v

logs: ## Mostra os logs de todos os containers
	docker-compose logs -f

logs-backend: ## Mostra logs do backend
	docker-compose logs -f backend

logs-frontend: ## Mostra logs do frontend
	docker-compose logs -f frontend

logs-mongodb: ## Mostra logs do MongoDB
	docker-compose logs -f mongodb

restart: ## Reinicia todos os containers
	docker-compose restart

restart-backend: ## Reinicia apenas o backend
	docker-compose restart backend

restart-frontend: ## Reinicia apenas o frontend
	docker-compose restart frontend

clean: ## Remove containers, imagens e volumes
	docker-compose down -v --rmi all

prod-up: ## Inicia em modo produção
	docker-compose -f docker-compose.prod.yml up --build -d

prod-down: ## Para containers de produção
	docker-compose -f docker-compose.prod.yml down

prod-logs: ## Mostra logs de produção
	docker-compose -f docker-compose.prod.yml logs -f

