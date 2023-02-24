import { run as runV2Worker } from "./workers/ListingV2Handler"

async function run() {
  const startV2Worker = () => {
    console.log("Starting Flow NFTStorefrontV2 event worker ....");
    runV2Worker();
  }

  startV2Worker();
}

const redOutput = "\x1b[31m%s\x1b[0m"

run().catch(e => {
  console.error(redOutput, e)
  process.exit(1)
})
