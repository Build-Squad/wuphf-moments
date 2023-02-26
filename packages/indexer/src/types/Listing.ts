export interface Listing {
  storefrontAddress?: string;
  storefrontResourceID?: number;
  listingResourceID: number;
  nftTypeID: string;
  nftUUID?: number;
  nftID: number;
  salePaymentVaultTypeID?: string;
  salePrice: number;
  customID?: string;
  commissionAmount?: number;
  commissionReceivers?: string[];
  expiry?: Date;
  createdAt?: Date;
  // Added with ListingCompletedEvent
  purchased: boolean;
  commissionReceiver?: string;
  completedAt?: Date;
  storefrontVersion: string;
  editionID?: number;
  serialNumber?: number;
}
