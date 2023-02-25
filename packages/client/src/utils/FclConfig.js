import * as fcl from '@onflow/fcl';

fcl.config({
  'flow.network': 'testnet',
  'app.detail.title': 'Wuphf moments',
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'app.detail.icon': 'https://placekitten.com/g/200/200',
  'discovery.wallet':
    'https://fcl-discovery.onflow.org/testnet/authn',
});

export const getFclConfiguration = () => {
  return fcl;
};
