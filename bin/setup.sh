#!/bin/bash

while [[ "$(curl -s -o /dev/null -w '%{http_code}' localhost:9200)" != "200" ]]
do
  sleep 1
done

curl -XGET "http://localhost:9200/_cluster/health?wait_for_status=yellow&timeout=90s"

curl -XPUT localhost:9200/listings -H "Content-Type: application/json" -d @packages/elastic/listings-mapping.json