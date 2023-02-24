# WUPHF For Moments

## Requirements

Make sure that you have installed:

- `Docker`

```bash
docker --version
```

- `Docker compose`

```bash
docker compose version
```

- `Make`

```bash
make --version
```

## Dependencies

Install `pnpm`:

```bash
npm add -g pnpm
```

Install dependencies:

```bash
pnpm install
```

## Setup

To setup your local development environment, run:

```bash
make setup
```

This will create the necessary images/containers, as well as the necessary indexes/mappings for Elasticsearch.

To index and view the sample ES documents, run:

```bash
curl -XPOST localhost:9200/listings/_create/904984337 -H "Content-Type: application/json" -d @packages/elastic/available-listing-V2.json | jq

curl -XPOST localhost:9200/listings/_create/903660704 -H "Content-Type: application/json" -d @packages/elastic/purchased-listing-V2.json | jq

curl -XGET localhost:9200/listings/_search | jq

curl -XPOST localhost:9200/alerts/_create/737216709 -H "Content-Type: application/json" -d @packages/elastic/alerts-document.json | jq

curl -XGET localhost:9200/alerts/_search | jq
```

## Index events

To start indexing `NFTStorefrontV2` events from the Flow blockchain, we have to run the indexer:

```bash
make index-events
```

You can view how many documents have been indexed to the `listings` index, by running:

```bash
curl -XGET localhost:9200/listings/_count | jq
```

## Miscellaneous

There are more `Make` recipes, than listed above, to assist with local development:

- Delete the `listings` index and its documents

```bash
make delete-es-index
```

- Setup the `listings` index and its mapping

```bash
setup-es-index
```

- Stop the running `Elasticsearch` and `Kibana` containers

```bash
make stop-containers
```

- Start the `Elasticsearch` and `Kibana` containers

```bash
start-containers
```
