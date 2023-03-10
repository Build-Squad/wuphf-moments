import { Client } from "@elastic/elasticsearch";
import { BulkOperationContainer } from "@elastic/elasticsearch/lib/api/types";
import { Listing } from "./types/Listing";

const client = new Client({
  node: "http://localhost:9200"
});

export async function matchingAlerts(listings: Listing[]) {
  let edition_ids = listings.map((listing) => listing.editionID);
  edition_ids = edition_ids.filter((edition_id) => edition_id != null);
  if (edition_ids.length == 0) {
    return [];
  }
  const elasticSearchIndex = "alerts";
  const query = {
    bool: {
      must: [
        {
          terms: { edition_id: edition_ids }
        }
      ]
    }
  };

  const results = await client.search({
    index: elasticSearchIndex,
    query: query
  });

  return results.hits.hits
}

export async function bulkInsert(listing: Array<Listing>) {
  const elasticSearchIndex = "listings";
  const operations = listing.flatMap((doc) => [
    {
      update: {
        _id: doc.listingResourceID.toString(),
        _index: elasticSearchIndex,
        retry_on_conflict: 3,
      },
    } as BulkOperationContainer,
    { doc: mapListingToDocument(doc), doc_as_upsert: true },
  ]);

  try {
    const bulkResponse = await client.bulk({
      index: elasticSearchIndex,
      refresh: true,
      operations,
    });
    if (bulkResponse.errors) {
      const erroredDocuments: any = [];
      bulkResponse.items.forEach((action: any, i) => {
        const operation: any = Object.keys(action)[0];
        if (action[operation].error) {
          erroredDocuments.push({
            status: action[operation].status,
            error: action[operation].error,
          });
        }
        if (action[operation].status == 429) {
          try {
          } catch (error) {
            console.log(
              "reinsertion of failed element produced an error: ",
              error
            );
          }
        }
      });
      console.log(erroredDocuments);
    }
  } catch (error) {
    console.error("Error while trying to insert listings in a batch: ", error);
    process.exit(1);
  }
}

function mapListingToDocument(listing: Listing): ListingDocument {
  return {
    storefront_address: listing.storefrontAddress,
    storefront_resource_id: listing.storefrontResourceID,
    listing_resource_id: listing.listingResourceID,
    nft_type_id: listing.nftTypeID,
    nft_uuid: listing.nftUUID,
    nft_id: listing.nftID,
    sale_payment_vault_type_id: listing.salePaymentVaultTypeID,
    sale_price: listing.salePrice,
    custom_id: listing.customID,
    commission_amount: listing.commissionAmount,
    allowed_commission_receivers: listing.commissionReceivers,
    expiry: listing.expiry,
    purchased: listing.purchased,
    commission_receiver: listing.commissionReceiver,
    created_at: listing.createdAt,
    completed_at: listing.completedAt,
    storefront_version: listing.storefrontVersion,
    edition_id: listing.editionID,
    serial_number: listing.serialNumber
  };
}

interface ListingDocument {
  storefront_address?: string;
  storefront_resource_id?: number;
  listing_resource_id?: number;
  nft_type_id: string;
  nft_uuid?: number;
  nft_id: number;
  sale_payment_vault_type_id?: string;
  sale_price?: number;
  custom_id?: string;
  commission_amount?: number;
  allowed_commission_receivers?: string[];
  expiry?: Date;
  purchased: boolean;
  commission_receiver?: string;
  created_at?: Date;
  completed_at?: Date;
  storefront_version: string;
  edition_id?: number;
  serial_number?: number;
}
