.PHONY: start-containers
start-containers:
	@echo "Starting containers..."
	docker compose up -d

.PHONY: setup-es-index
setup-es-index: bin/setup.sh
	@echo "Setting up Elasticsearch listings index"
	bash bin/setup.sh

setup: start-containers setup-es-index

.PHONY: stop-containers
stop-containers:
	@echo "Stopping containers..."
	docker compose down

.PHONY: delete-es-index
delete-es-index:
	@echo "Deleting Elasticsearch listings index"
	curl -XDELETE localhost:9200/listings
