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

  const [user, setUser] = useState<User>({
    addr: null,
    cid: null,
    loggedIn: null,
    expiresAt: null,
    services: []
  })
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertInstances, setAlertInstances] = useState<{[key: number]: AlertInstance[]}>({})
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(Notification.permission === 'granted')
  
  const handleFetchAlerts = (userAddress: string) => {
    fetchAlerts(userAddress as string)
      .then(setAlerts)
      .catch(console.error)
  }
  
  const handleDeleteAlert = (edition_id: number) => {
    deleteAlert(user.addr as string, edition_id)
      .then(() => {
        console.info(`Alert for edition '${edition_id}' has been deleted`)
        // looks like the new alert is not immediatly available in index
        setTimeout(() => handleFetchAlerts(user.addr as string), 1000)
      })
      .catch(console.error)
  }
  
  const handleCreateAlert = (formPayload: Omit<Alert, 'address'>) => {
    createAlert(user.addr as string, formPayload)
      .then(() => {
        console.info(`Alert for Edition '${formPayload.edition_id}' has been created`)
        // looks like the new alert is not immediatly available in index
        setTimeout(() => handleFetchAlerts(user.addr as string), 1000)
      })
  }
  
  const handleIncomingAlert = (msg: string) => {
    if(msg === user.addr) {
      console.info(`Listening alerts for user ${user.addr}`)
    } else {
      const { edition_id, ...newInstance }: { edition_id: number } & AlertInstance = JSON.parse(msg)
      console.info(`Incomoing alert for Edition '${edition_id}'`)
      setAlertInstances({
        ...alertInstances,
        [edition_id]: [
          newInstance,
          ...(alertInstances[edition_id] ?? [])
        ] 
      })
      if (notificationsEnabled) {
        const myNotification = new Notification(
          `Edition ${edition_id}`,
          {
            body: `has been listed for ${newInstance.sale_price} $`
          }
        )
      }
    }
  }
  
  const handleToggleNotifications = async () => {
    if (!notificationsEnabled && Notification.permission !== 'granted') {
      await Notification.requestPermission()
    }
    if (Notification.permission === 'granted') {
      setNotificationsEnabled(!notificationsEnabled)
    } else {
      setNotificationsEnabled(false)
    }
  }
  
  const handleFlush = (edition_id: number) => {
    const copy = { ...alertInstances }
    delete copy[edition_id]
    setAlertInstances(copy)
  }
  
  const hadleFlushAll = () => {
    setAlertInstances({})
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
      <Container as="aside">
        <Form onAlertCreate={ handleCreateAlert }/>
      </Container>
      { alerts.length !== 0 &&
        <Container as="article">
          <List 
            alerts={ alerts }
            alertInstances={ alertInstances }
            notificationsEnabled={ notificationsEnabled }
            onDelete={ handleDeleteAlert }
            onFlush={ handleFlush }
            onFlushAll={ hadleFlushAll }
            onToggleNotification={ handleToggleNotifications }
          />
        </Container>
      }
    </>
  )
}

export default App
