interface ListingV2EventData {
  // NFTStorefrontV2.ListingAvailable payload data
  storefrontAddress?: string;
  listingResourceID: string;
  nftType: { typeID: string };
  nftUUID: string;
  nftID: string;
  salePaymentVaultType: { typeID: string };
  salePrice: string;
  customID?: string;
  commissionAmount: string;
  commissionReceivers?: string[];
  expiry: string;
  // NFTStorefrontV2.ListingCompleted payload data
  storefrontResourceID?: string;
  purchased?: boolean;
  commissionReceiver?: string;
}

export interface ListingV2Event {
  blockId: string;
  blockHeight: number;
  blockTimestamp: string;
  type: string;
  transactionId: string;
  transactionIndex: number;
  eventIndex: number;
  data: ListingV2EventData;
}
