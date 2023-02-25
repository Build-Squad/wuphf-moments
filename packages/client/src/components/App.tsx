import React from 'react'
import { Container, Header } from 'semantic-ui-react'

import 'fomantic-ui-css/semantic.css'
import './App.css'

import Form from './Form'
import List from './List'


function App() {
  return (
    <>
      <Container textAlign="center" as="header">
        <Header as="h1">
          WUPHF For Moments
        </Header>
      </Container>
      <Container as="article">
        <Form />
      </Container>
      <Container as="aside">
        <List />
      </Container>
    </>
  );
}

export default App
