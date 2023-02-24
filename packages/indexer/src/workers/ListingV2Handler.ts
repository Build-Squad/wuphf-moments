import * as fcl from "@onflow/fcl";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { bulkInsert, matchingAlerts } from "../elastic";
import { sleep } from "../lib";
import { Listing } from "../types/Listing";
import { ListingV2Event } from "../types/ListingV2Event";

fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org"
});

enum NFTStorefrontV2Event {
  ListingAvailable = "A.4eb8a10cb9f87357.NFTStorefrontV2.ListingAvailable",
  ListingCompleted = "A.4eb8a10cb9f87357.NFTStorefrontV2.ListingCompleted",
}

enum DapperContracts {
  Golazos = "A.87ca73a41bb50ad5.Golazos.NFT"
}

const STOREFRONT_VERSION = 'V2';

// Mainnet 22 spork root
const ROOT_BLOCK_HEIGHT = 47169687;
const BLOCKS_PER_REQUEST = 3000;
const WAIT_FOR_NEXT_BLOCK = 3000;

// Start at cursor or spork root
let currentStartBlockHeight =
  parseInt(
    readFileSync(resolve(__dirname, "../../data/cursorV2")).toString("utf-8")
  ) || ROOT_BLOCK_HEIGHT;

export async function run() {
  while (true) {
    try {
      const latestBlock = await fcl.block({ sealed: true });
      const latestBlockHeight = latestBlock.height;
      const start = currentStartBlockHeight;
      // End: start + offset or latest block height, whichever is smaller
      const end = Math.min(
        latestBlockHeight,
        currentStartBlockHeight + BLOCKS_PER_REQUEST
      );

      if (start >= end) {
        console.log(
          `No new blocks to scan, waiting ${WAIT_FOR_NEXT_BLOCK / 1000}s…`
        );
        await sleep(WAIT_FOR_NEXT_BLOCK);
        continue;
      }

      console.log("Importing blocks", start, "to", end, "for NFTStorefrontV2!");

      const [availableEvents, completedEvents] = await Promise.all([
        getEvents(NFTStorefrontV2Event.ListingAvailable, start, end),
        getEvents(NFTStorefrontV2Event.ListingCompleted, start, end),
      ]);

      {
        if (availableEvents.length) {
          const availableListings = availableEvents.map(mapEventToListing);
          await bulkInsert(availableListings);
          console.log(
            "Imported",
            availableListings.length,
            "NFTstorefrontV2.ListingAvailable events"
          );
          const alerts = await matchingAlerts(availableListings);
          alerts.forEach((alert: any) => {
            alert._source.rules.forEach((rule: any) => {
              const listing = availableListings.find((e) => e.nftID === alert._source.nft_id);
              if (listing != undefined && rule.price_threshold < listing.salePrice) {
                console.log(
                  `Hey there, ${rule.email}. We just wanted to let you know that the sale price for NFT ${alert._source.nft_id}, is currently at ${listing?.salePrice}`
                );
              }
            });
          });
        }
      }

      {
        if (completedEvents.length) {
          const completedListings = completedEvents.map(mapEventToListing);
          await bulkInsert(completedListings);
          console.log(
            "Imported",
            completedListings.length,
            "NFTstorefrontV2.ListingCompleted events"
          );
        }
      }

      // Set start block height to the next block
      currentStartBlockHeight = end + 1;

      writeFileSync(
        resolve(__dirname, "../../data/cursorV2"),
        currentStartBlockHeight.toString()
      );
    } catch (e) {
      console.error(e);
      console.warn("Retrying in 5 seconds…");
      await sleep(5000);
    }
  }
}

async function getEvents(
  kind: NFTStorefrontV2Event,
  start: number,
  end: number
): Promise<ListingV2Event[]> {
  let scans: Promise<ListingV2Event[]>[] = [];

  for (let i = start; i < end; i += 250) {
    const thisStart = i;
    const thisEnd = Math.min(i + 249, end);

    scans.push(
      fcl
        .send([fcl.getEventsAtBlockHeightRange(kind, thisStart, thisEnd)])
        .then(fcl.decode)
    );
  }

  const events = (await Promise.all(scans)).flat();
  return events.filter((event) => {
    return event.data.nftType.typeID === DapperContracts.Golazos
  });
}

function mapEventToListing({
  type,
  blockTimestamp,
  data,
}: ListingV2Event): Listing {
  const isCompletedEvent = type === NFTStorefrontV2Event.ListingCompleted;

  return {
    storefrontAddress: data.storefrontAddress,
    storefrontResourceID: data.storefrontResourceID
      ? parseInt(data.storefrontResourceID)
      : undefined,
    listingResourceID: parseInt(data.listingResourceID),
    nftTypeID: data.nftType.typeID,
    nftUUID: parseInt(data.nftUUID),
    nftID: parseInt(data.nftID),
    salePaymentVaultTypeID: data.salePaymentVaultType.typeID,
    salePrice: parseFloat(data.salePrice),
    customID: data.customID,
    commissionAmount: parseFloat(data.commissionAmount),
    commissionReceivers: data.commissionReceivers,
    expiry: new Date(parseInt(data.expiry) * 100),
    purchased: data.purchased ?? false,
    commissionReceiver: data.commissionReceiver,
    createdAt: !isCompletedEvent ? new Date(blockTimestamp) : undefined,
    completedAt: isCompletedEvent ? new Date(blockTimestamp) : undefined,
    storefrontVersion: STOREFRONT_VERSION
  };
}
