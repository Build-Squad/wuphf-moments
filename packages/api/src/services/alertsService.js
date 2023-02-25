class AlertsService {
  constructor(elasticClient) {
    this.client = elasticClient;
    this.index = 'alerts';
  }

  finalResut(result) {
    if (result.hasOwnProperty('hits')) {
      if (result.hits.hasOwnProperty('hits')) {
        return result.hits.hits;
      }
    }

    return result;
  }

  getAlertsForAddress = async (address) => {
    const query = {
      nested: {
        path: "rules",
        query: {
          bool: {
            must: [
              {
                match: {
                  "rules.address": address
                }
              }
            ]
          }
        }
      }
    };

    const result = await this.client.search({
      index: this.index,
      query: query
    });

    return this.finalResut(result);
  };

  createNewAlert = async (payload) => {
    const query = {
      bool: {
        must: [
          {
            term: { nft_id: payload.nft_id }
          }
        ]
      }
    };

    const results = await this.client.search({
      index: this.index,
      query: query
    });

    if (results.hits.hits.length == 1) {
      const rules = results.hits.hits[0]._source.rules;
      payload.rules = payload.rules.concat(rules);
      const result = await this.client.update({
        index: this.index,
        id: payload.nft_id,
        doc: payload
      });

      return result;
    }

    const result = await this.client.index({
      index: this.index,
      id: payload.nft_id,
      document: payload
    });

    return result;
  }

  deleteAlert = async (nft_id, address) => {
    const query = {
      bool: {
        must: [
          {
            term: { nft_id: nft_id }
          },
          {
            nested: {
              path: "rules",
              query: {
                bool: {
                  must: [
                    {
                      match: {
                        "rules.address": address
                      }
                    }
                  ]
                }
              }
            }
          }
        ]
      }
    };

    const results = await this.client.search({
      index: this.index,
      query: query
    });

    if (results.hits.hits.length == 1) {
      const document = results.hits.hits[0]._source;
      document.rules = document.rules.filter((rule) => {
        console.log(rule.address == address);
        return rule.address != address;
      });
      const result = await this.client.update({
        index: this.index,
        id: nft_id,
        doc: document
      });

      return result;
    }

    return {};
  }
}

export { AlertsService };
