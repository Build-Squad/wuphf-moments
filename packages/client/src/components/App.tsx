import React, { useState} from 'react'
import { Container, Header } from 'semantic-ui-react'

import 'fomantic-ui-css/semantic.css'
import './App.css'

import Form from './Form'
import List from './List'


const commonHeaders= new Headers({
  'Content-Type': 'application/json'
})

function App() {
  
  const [alerts, setAlerts] = useState([])
  const [accountId, setAccountId] = useState(null)

  const fetchList = async () => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/${accountId}`, {
      headers: commonHeaders
    })
    if (response.ok) {
      const json = await response.json()
      setAlerts(json)
    } else {
      console.error(response)
    }
  }
  
  const handleAlertDelete = async (nftId: number) => {
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/${nftId}/${accountId}`, {
      method: 'DELETE',
      headers: commonHeaders
    })
    if (response.ok) {
      console.info(`Alert for NFT '${nftId}' has been deleted`)
      fetchList()
    } else {
      console.error(response)
    }
  }
  
  const handleAlertCreate = async (formPayload: any) => {
    // TODO asks the user to sign it
    const response = await fetch(`${process.env.REACT_APP_API_BASE}/`, {
      method: 'POST',
      headers: commonHeaders,
      body: JSON.stringify(formPayload)
    })
    if(response.ok) {
      console.info(`Alert for NFT '${formPayload.nftId}' has been created`)
      fetchList()
    } else {
      console.error(response)
    }
  }
  
  return (
    <>
      <Container textAlign="center" as="header">
        <Header as="h1">
          WUPHF For Moments
        </Header>
      </Container>
      <Container as="article">
        <Form onAlertCreate={ handleAlertCreate }/>
      </Container>
      <Container as="aside">
        <List alerts={ alerts } onDelete={ handleAlertDelete }/>
      </Container>
    </>
  );
}

export default App
