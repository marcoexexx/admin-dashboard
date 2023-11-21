DOCKER_COMPOSE_FILE := ./docker-compose.yaml

.DEFAULT_GOAL := help

help:
	@echo "Usage:"
	@echo "  make start			- Start Docker Compose services"
	@echo "  make stop			- Stop and remove Docker Compose services"
	@echo "  make clean			- Remove all Docker comtainers, networks and volumns"
	@echo "  make help			- Display help"


start:
	sudo docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

stop:
	sudo docker-compose -f $(DOCKER_COMPOSE_FILE) down

clean:
	sudo docker-compose down --volumes # --rmi all
