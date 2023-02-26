.PHONY: start-containers
start-containers:
	@echo "Starting containers..."
	docker compose up -d

.PHONY: generate-cursor-files
generate-cursor-files:
	@echo "Generating indexer cursor files..."
	rm -f packages/indexer/data/cursorV2 && touch packages/indexer/data/cursorV2

.PHONY: setup-es-index
setup-es-index: bin/setup.sh
	@echo "Setting up Elasticsearch listings index"
	bash bin/setup.sh

setup: start-containers generate-cursor-files setup-es-index

.PHONY: index-events
index-events:
	@echo "Indexing storefront listings events..."
	cd packages/indexer && pnpm run dev

.PHONY: start-api
start-api:
	@echo "Starting API..."
	cd packages/api && npm start

.PHONY: stop-containers
stop-containers:
	@echo "Stopping containers..."
	docker compose down

.PHONY: delete-es-index
delete-es-index:
	@echo "Deleting Elasticsearch listings index"
	curl -XDELETE localhost:9200/listings
	@echo "Deleting Elasticsearch alerts index"
	curl -XDELETE localhost:9200/alerts
