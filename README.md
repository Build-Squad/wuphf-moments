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

## Setup

```bash
make setup

curl -XPOST localhost:9200/listings/_create/853563399 -H "Content-Type: application/json" -d @packages/elastic/available-listing-V2.json | jq

curl -XPOST localhost:9200/listings/_create/776378930 -H "Content-Type: application/json" -d @packages/elastic/purchased-listing-V2.json | jq

curl -XGET localhost:9200/listings/_search | jq
```