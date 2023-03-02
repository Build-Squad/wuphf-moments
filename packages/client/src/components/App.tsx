import React, { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'

import 'fomantic-ui-css/semantic.css'
import './App.css'

import useAlertInstances from '../utils/useAlertInstances'
import { fetchAlerts, deleteAlert, createAlert } from '../utils/api'
import ConnectWallet from './Header'
import Form from './Form'
import List from './List'

import type { User, Alert } from '../types'

function App() {

  const [user, setUser] = useState<User>({
    addr: null,
    cid: null,
    loggedIn: null,
    expiresAt: null,
    services: []
  })
  const [alerts, setAlerts] = useState<Alert[]>([])
  
  const { 
    alertInstances, notificationsEnabled,
    onToggleNotifcations, onFlushEdition, onFlushAll
  } = useAlertInstances(user.addr)
  
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
  
  useEffect(() => {
    if (user.addr !== null) {
      handleFetchAlerts(user.addr)
    }
  }, [user.addr])
  
  
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
            onFlushEdition={ onFlushEdition }
            onFlushAll={ onFlushAll }
            onToggleNotification={ onToggleNotifcations }
          />
        </Container>
      }
    </>
  )
}

export default App
