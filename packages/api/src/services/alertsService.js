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
            term: { edition_id: payload.edition_id }
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
        id: payload.edition_id,
        doc: payload
      });

      return result;
    }

    const result = await this.client.index({
      index: this.index,
      id: payload.edition_id,
      document: payload
    });

    return result;
  }

  deleteAlert = async (edition_id, address) => {
    const query = {
      bool: {
        must: [
          {
            term: { edition_id: edition_id }
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
        return rule.address != address;
      });
      const result = await this.client.update({
        index: this.index,
        id: edition_id,
        doc: document
      });

      return result;
    }

    return {};
  }
}

export { AlertsService };
