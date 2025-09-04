COMPOSE_SRSC=./docker-compose.yml
NAME=transcendence

all: 	build up

build:
	sudo docker compose -f $(COMPOSE_SRSC) -p $(NAME) build --no-cache
up: 
	sudo docker compose -f $(COMPOSE_SRSC) -p $(NAME) up -d
down: 
	sudo docker compose -f $(COMPOSE_SRSC) -p $(NAME) down -v
stop:
	sudo docker compose -f $(COMPOSE_SRSC) -p $(NAME) stop
rm: stop
	sudo docker compose -f $(COMPOSE_SRSC) -p $(NAME) rm
rm_vol:
	sudo docker compose -f ./docker-compose.yml down --volumes
prune_docker:
	sudo docker system prune
delete_volumes:
	sudo docker compose -f ./docker-compose.yml down --volumes
fclean:
	sudo docker compose down --volumes --remove-orphans
	@docker stop $$(docker ps -aq) 2>/dev/null || true
	@docker rm -f $$(docker ps -aq) 2>/dev/null || true
	@docker rmi -f $$(docker images -aq) 2>/dev/null || true
	@docker volume rm $$(docker volume ls -q) 2>/dev/null || true
	@docker network rm $$(docker network ls -q) 2>/dev/null || true
	@docker system prune -a --volumes --force

re: fclean all

