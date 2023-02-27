const defaultPort = 3000;

export function getConfig(env) {
  env = env ?? process.env;

  console.log('ENV = ' + JSON.stringify(env));

  const port = env.PORT || defaultPort;
  const node = env.NODE;
  const fcl = {
    'flow.network': process.env.FCL_FLOW_NETWORK,
    'app.detail.title': env.FCL_TITLE,
    'accessNode.api': env.FCL_ACCESS_NODE_API,
    'app.detail.icon': 'https://placekitten.com/g/200/200',
    'discovery.wallet': env.FCL_DISCOVERY_WALLET
  };

  return {
    port,
    node,
    fcl
  };
}
