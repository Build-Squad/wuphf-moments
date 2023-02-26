import {useState, useEffect} from 'react';
import {getFclConfiguration} from '../utils/FclConfig';
import {Header} from 'semantic-ui-react';
const fcl = getFclConfiguration();

const ConnectWallet = ({ user, onUserSet }) => {

  useEffect(() => {
    fcl.currentUser().subscribe(onUserSet);
  }, [onUserSet]);

  const onConnectWallet = () => {
    fcl.authenticate();
  };

  const onDisconnectWallet = () => {
    fcl.unauthenticate();
  };

  return (
    <Header>
      WUPHF For Moments
      <div>
        <div class="elementor-widget-container">
          <div class="elementor-button-wrapper">
          { user && user.addr ? (
          <button onClick={ onDisconnectWallet }>Disconnect Wallet</button>
        ) : (
          <button onClick={ onConnectWallet }>Connect Wallet</button>
        ) }
          </div>
        </div>
      </div>
    </Header>
  );
};

export default ConnectWallet;
