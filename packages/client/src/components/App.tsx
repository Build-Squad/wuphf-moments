import React, { useRef, useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'
import useWebSocket, { ReadyState } from 'react-use-websocket'


import 'fomantic-ui-css/semantic.css'
import './App.css'

import { fetchAlerts, deleteAlert, createAlert } from '../utils/api'
import ConnectWallet from './Header'
import Form from './Form'
import List from './List'

import type { User, Alert, AlertInstance } from '../types'

function App() {

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertInstances, setAlertInstances] = useState<{[key: number]: AlertInstance[]}>({})
  const [user, setUser] = useState<User>({
    addr: null,
    cid: null,
    loggedIn: null,
    expiresAt: null,
    services: []
  })
  
  const handleFetchAlerts = (userAddress: string) => {
    fetchAlerts(userAddress as string)
      .then(setAlerts)
      .catch(console.error)
  }
  
  const handleDeleteAlert = (edition_id: number) => {
    deleteAlert(user.addr as string, edition_id)
    .then(() => {
      console.info(`Alert for edition '${edition_id}' has been deleted`)
      setTimeout(() => handleFetchAlerts(user.addr as string), 1000) // looks like the new alert is not immediatly available in index
    })
    .catch(console.error)
  }
  
  const handleCreateAlert = (formPayload: Omit<Alert, 'address'>) => {
    createAlert(user.addr as string, formPayload)
    .then(() => {
      console.info(`Alert for Edition '${formPayload.edition_id}' has been created`)
      setTimeout(() => handleFetchAlerts(user.addr as string), 1000) // looks like the new alert is not immediatly available in index
    })
  }
  
  const handleIncomingAlert = (msg: string) => {
    if(msg === user.addr) {
      console.info(`Listening alerts for user ${user.addr}`)
    } else {
      const { sale_price, edition_id, nft_id } = JSON.parse(msg)
      const newInstance: AlertInstance = { nft_id, sale_price }
      setAlertInstances({
        ...alertInstances,
        [edition_id]: [
          newInstance,
          ...(alertInstances[edition_id] ?? [])
        ] 
      })
    }
  }
  
  const handleFlushList = (edition_id: number) => {
    setAlertInstances({
      ...alertInstances,
      [edition_id]: []
    })
  }

  const { sendMessage, readyState } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET as string, { 
      protocols: 'echo-protocol',
      onError: console.error,
      shouldReconnect: (closeEvent) => true,
      onMessage: (e) => handleIncomingAlert(e.data)
    }
  )
  
  useEffect(() => {
    if (user.addr !== null) {
      handleFetchAlerts(user.addr)
    }
  }, [user.addr])
  
  useEffect(() => {
    if (user.addr !== null && readyState === ReadyState.OPEN) {
      // asks the servers to send alerts 
      sendMessage(user.addr)
    }
  }, [user.addr, readyState])
  
  return (
    <>
      <Container textAlign="center" as="header">
        <ConnectWallet user={ user } onUserSet={ setUser } />
      </Container>
      <Container as="article">
        <Form onAlertCreate={ handleCreateAlert }/>
      </Container>
      { alerts.length !== 0 &&
        <Container as="aside">
          <List 
            alerts={ alerts }
            alertInstances={ alertInstances }
            onDelete={ handleDeleteAlert }
            onFlush={ handleFlushList }
          />
        </Container>
      }
    </>
  )
}

export default App
