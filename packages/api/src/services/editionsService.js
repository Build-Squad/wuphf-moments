class EditionsService {
  constructor(elasticClient) {
    this.client = elasticClient;
    this.index = 'listings';
  }

  getListingsForEdition = async (edition_id) => {
    const query = {
      bool: {
        must: [
          {
            term: { edition_id: edition_id }
          },
          {
            term: { purchased: false }
          }
        ]
      }
    };

    const results = await this.client.search({
      _source: [
        "sale_price", "created_at"
      ],
      index: this.index,
      query: query,
      sort: [
        {
          created_at: "asc"
        }
      ]
    });

    return results.hits.hits.map((doc) => {
      return doc._source;
    });
  }

  getSalesForEdition = async (edition_id) => {
    const query = {
      bool: {
        must: [
          {
            term: { edition_id: edition_id }
          },
          {
            term: { purchased: true }
          }
        ]
      }
    };

    const results = await this.client.search({
      _source: [
        "sale_price", "completed_at"
      ],
      index: this.index,
      query: query,
      sort: [
        {
          completed_at: "asc"
        }
      ]
    });

    return results.hits.hits.map((doc) => {
      return doc._source;
    });
  }

}

export { EditionsService };
