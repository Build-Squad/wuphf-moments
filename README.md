# wuphf-moments

## Setup

```bash
docker compose up -d

bash bin/setup.sh

curl -XGET localhost:9200/listings/_count | jq
```