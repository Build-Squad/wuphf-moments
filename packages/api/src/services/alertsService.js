class AlertsService {
  constructor(elasticClient) {
    this.client = elasticClient;
    this.index = 'alerts';
  }

  finalResut(result, address) {
    if (result.hasOwnProperty('hits')) {
      if (result.hits.hasOwnProperty('hits')) {
        return result.hits.hits
          .map((doc) => ({
            edition_id: doc._source.edition_id,
            // keep only the rule matching the address
            ...doc._source.rules.find((rule) => rule.address == address)
          })
        );
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

    return this.finalResut(result, address);
  };

  createNewAlert = async (payload) => {
    const { edition_id, ...new_rule } = payload;

    const query = {
      bool: {
        must: [
          {
            term: { edition_id }
          }
        ]
      }
    };

    const results = await this.client.search({
      index: this.index,
      query: query
    });

    if (results.hits.hits.length == 1) {
      let rules = results.hits.hits[0]._source.rules;
      let rule_exists = false
      // replace an existing rule with the same address
      rules = rules.map((rule) => {
        if (rule.address == new_rule.address) {
          rule_exists = true;
          return new_rule;
        } else {
          return rule;
        }
      });
      // add the new rule if none already exists with same address
      if (!rule_exists) {
        rules.push(new_rule);
      }
      const result = await this.client.update({
        index: this.index,
        id: edition_id,
        doc: {
          edition_id,
          rules
        }
      });

      return result;
    }

    // add the new rule in a new document
    const result = await this.client.index({
      index: this.index,
      id: edition_id,
      document: {
        edition_id,
        rules: [ new_rule ]
      }
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
