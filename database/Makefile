# Project name
NAME = database

# Paths
SRC_DIR = .
DCOMPOSE_FILE = $(SRC_DIR)/docker-compose.yml

# Docker commands
DOCKER_COMPOSE = docker-compose -f $(DCOMPOSE_FILE)

# Default rule
all: build

build:
	@echo "🚀 Building the containers..."
	$(DOCKER_COMPOSE) build --no-cache

start:
	@echo "▶️ Starting the containers..."
	$(DOCKER_COMPOSE) up -d

stop:
	@echo "⏹️ Stopping the containers..."
	$(DOCKER_COMPOSE) down

clean:
	@echo "🗑️ Removing containers and volumes..."
	$(DOCKER_COMPOSE) down -v

fclean: clean

re: fclean build

logs-sqlite:
	@echo "📜 SQLite logs:"
	docker logs sqlite-init

shell-sqlite:
	@echo "🔧 Accessing SQLite container..."
	docker exec -it sqlite-init sh

