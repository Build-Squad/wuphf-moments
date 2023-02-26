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

To view the sample ES documents, from the two indexes, run:

```bash
curl -XGET localhost:9200/listings/_search | jq

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

## Run the API

```bash
make start-api
```

There are 3 available endpoints:

- View alerts for an address,
- Create a new alert for an address,
- Remove an alert for an address

```bash
curl -XGET 'localhost:3000/alerts/0x9a0766d93b6608b7' -H "Content-Type: application/json" | jq

curl -XPOST localhost:3000/alerts/ -H "Content-Type: application/json" -d @packages/elastic/alerts-document-2.json

curl -XDELETE 'localhost:3000/alerts/132/0xee82856bf20e2c07' -H "Content-Type: application/json"
```

## Run the front-end



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
