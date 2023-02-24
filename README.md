# wuphf-moments

## Setup

```bash
docker compose up -d

bash bin/setup.sh

curl -XPOST localhost:9200/listings/_create/853563399 -H "Content-Type: application/json" -d @packages/elastic/available-listing-V2.json | jq

curl -XPOST localhost:9200/listings/_create/776378930 -H "Content-Type: application/json" -d @packages/elastic/purchased-listing-V2.json | jq

curl -XGET localhost:9200/listings/_search | jq
```