import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';
import * as fcl from '@onflow/fcl';
import initApp from './app.js';
import { getConfig } from './config.js';

const envVars = dotenv.config({
  path: '.env.local'
});

async function run() {
  const config = getConfig(envVars.parsed);

  const elasticSearchClient = new Client({
    node: config.node
  });
  fcl.config(config.fcl);

  console.log('Starting API server ....');
  console.log(config);
  
  const app = initApp(elasticSearchClient, fcl);
  const server = app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}!`);
  });

  process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    console.log('Closing API server ....');
    server.close(() => {
      console.log('API server closed ....');
    });
  });
}

const redOutput = '\x1b[31m%s\x1b[0m';

run().catch((e) => {
  console.error(redOutput, e);
  process.exit(1);
});
