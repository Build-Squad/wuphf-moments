import React from 'react';
import { Container } from 'semantic-ui-react';
import ConnectWallet from './Header';

import 'fomantic-ui-css/semantic.css'
import './App.css'

import Form from './Form';
import List from './List';

function App() {
  return (
    <>
      <Container textAlign="center" as="header">
        <ConnectWallet />
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
