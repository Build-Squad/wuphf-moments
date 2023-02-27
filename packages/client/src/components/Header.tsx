import React, {useEffect } from 'react'
import { getFclConfiguration } from '../utils/FclConfig'
import { Header } from 'semantic-ui-react'

import type { Dispatch, SetStateAction } from 'react'
import type { User } from '../types'

const fcl = getFclConfiguration()

const ConnectWallet = (
  { user, onUserSet }:
  { user: User, onUserSet: Dispatch<SetStateAction<User>> }
) => {

  useEffect(() => {
    fcl.currentUser.subscribe(onUserSet);
  }, [onUserSet])

  const onConnectWallet = () => {
    fcl.authenticate()
  };

  const onDisconnectWallet = () => {
    fcl.unauthenticate()
  };

  return (
    <Header>
      WUPHF For Moments
      <div>
        <div className="elementor-widget-container">
          <div className="elementor-button-wrapper">
          { user && user.addr ? (
          <button onClick={ onDisconnectWallet }>Disconnect Wallet</button>
        ) : (
          <button onClick={ onConnectWallet }>Connect Wallet</button>
        ) }
          </div>
        </div>
      </div>
    </Header>
  )
}

export default ConnectWallet
