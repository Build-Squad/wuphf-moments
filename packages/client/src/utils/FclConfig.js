import * as fcl from '@onflow/fcl';

fcl.config({
  'flow.network': process.env.REACT_APP_FCL_FLOW_NETWORK,
  'app.detail.title': process.env.REACT_APP_FCL_TITLE,
  'accessNode.api': process.env.REACT_APP_FCL_ACCESS_NODE_API,
  'app.detail.icon': 'https://placekitten.com/g/200/200',
  'discovery.wallet': process.env.REACT_APP_FCL_DISCOVERY_WALLET,
});

export const getFclConfiguration = () => {
  return fcl;
};
