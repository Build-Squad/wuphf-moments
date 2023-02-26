import React, { useCallback, useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'
import ConnectWallet from './Header'

import 'fomantic-ui-css/semantic.css'
import './App.css'

import Form from './Form'
import List from './List'

const commonHeaders = new Headers({
  'Content-Type': 'application/json'
})

function App() {

  const [alerts, setAlerts] = useState([])
  const [user, setUser] = useState({
    addr: null
  })

  const fetchList = useCallback(async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/${user.addr}`, {
      headers: commonHeaders
    })
    if (response.ok) {
      const json = await response.json()
      setAlerts(json.alerts)
    } else {
      console.error(response)
    }
  }, [user.addr])

  const handleAlertDelete = useCallback(async (nftId: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/${nftId}/${user.addr}`, {
      method: 'DELETE',
      headers: commonHeaders
    })
    if (response.ok) {
      console.info(`Alert for NFT '${nftId}' has been deleted`)
      setTimeout(fetchList, 1000) // looks like the new alert is not immediatly available in index
    } else {
      console.error(response)
    }
  }, [fetchList, user.addr])

  const handleAlertCreate = useCallback(async (formPayload: any) => {
    // TODO asks the user to sign it
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify({ address: user.addr, ...formPayload })
    })
    if(response.ok) {
      console.info(`Alert for Edition '${formPayload.edition_id}' has been created`)
      setTimeout(fetchList, 1000) // looks like the new alert is not immediatly available in index
    } else {
      console.error(response)
    }
  }, [fetchList, user.addr])
  
  useEffect(() => {
    if( user.addr !== null) {
      fetchList()
    }
  }, [user.addr])
  
  return (
    <>
      <Container textAlign="center" as="header">
        <ConnectWallet user={ user } onUserSet={ setUser } />
      </Container>
      <Container as="article">
        <Form onAlertCreate={ handleAlertCreate }/>
      </Container>
      { alerts.length !== 0 &&
        <Container as="aside">
          <List alerts={ alerts } onDelete={ handleAlertDelete }/>
        </Container>
      }
    </>
  )
}

export default App
