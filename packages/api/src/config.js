const defaultPort = 3000;

export function getConfig(env) {
  env = env ?? process.env;

  console.log('ENV = ' + JSON.stringify(env));

  const port = env.PORT || defaultPort;
  const node = env.NODE;

  return {
    port,
    node
  };
}
