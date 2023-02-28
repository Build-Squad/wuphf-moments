import { Item, Message, Icon, Label, Button, List } from 'semantic-ui-react'

import type { Alert, AlertInstance } from '../types'

export default function AppList(
  { alerts, alertInstances, onDelete, onFlush }:
  { 
    alerts: Alert[],
    alertInstances: {[key: number]: AlertInstance[]},
    onDelete: (editionId: number) => void,
    onFlush: (editionId: number) => void,
  }
) {
  return (
    <>
      <Message attached icon>
        <Icon name="list" />
        <Message.Content>
          <Message.Header as="h2">
            Your active alerts
          </Message.Header>
          <p>blah</p>
        </Message.Content>
      </Message>
      <Item.Group divided className="attached segment">
        { alerts.map((alert: any) => <OneAlert 
          key={ alert.edition_id }
          alert={ alert }
          alertInstances={ alertInstances[alert.edition_id] }
          onDelete={ () => onDelete(alert.edition_id) }
          onFlush={ () => onFlush(alert.edition_id) }
        />) }
      </Item.Group>
    </>
  )
}


function OneAlert(
  { alert, alertInstances = [], onDelete, onFlush }:
  { alert: any, alertInstances: AlertInstance[], onDelete: () => void, onFlush: () => void }
) {
  // TODO get the current price
  const current_price = Math.round(Math.random() * 1000 * 100) / 100

  return (
    <Item className={ alertInstances.length !== 0 ? 'on-alert' : '' }>
      <Item.Image size="tiny" src="/images/wireframe/image.png" alt="Media from the NFT"/>
      <Item.Content>
        <Button.Group vertical floated="right">
          <Button circular icon='delete' onClick={ onDelete }/>
          <Button circular icon='cut' onClick={ onFlush }/>
        </Button.Group>
        <InstancesList alertInstances={ alertInstances } />
        <Item.Header 
          as="a"
          target="_blank"
          href={ `https://laligagolazos.com/editions/${ alert.edition_id }` }
        >
          Edition { alert.edition_id } 
          &nbsp;<Icon name='external' size='small' />
        </Item.Header>
        <Item.Meta>
          <Label>
            <Icon name="dollar" />{ alert.min_price }
            <Label.Detail>Alert price</Label.Detail>
          </Label>
          <Label color={ current_price > alert.min_price ? 'red' : 'green' }>
            <Icon name="dollar"/>{ current_price }[fake]
            <Label.Detail>Current price</Label.Detail>
          </Label>
        </Item.Meta>
        <Item.Description>Additional Details from the NFT data</Item.Description>
        
      </Item.Content>
    </Item>
  )

}


function InstancesList({ alertInstances = []}: { alertInstances: AlertInstance[] }) {
  if (alertInstances.length == 0) {
    return <></>
  } else {
    return (
      <List floated="right" size="mini">
        { alertInstances.slice(0, 5).map((instance, i) => 
          <List.Item key={ i }>
            <List.Content>
              <List.Header  as="a" href={ `https://laligagolazos.com/moments/${instance.nft_id}` }>
                Serial (or NFT id) { instance.nft_id }
                &nbsp;<Icon name='external' size='small' />
              </List.Header>
              <List.Description>Listed at { instance.sale_price } $</List.Description>
            </List.Content>
          </List.Item>
        ) }
        { alertInstances.length > 5 && 
          <List.Item key="more">
            <List.Content>
              <List.Header>And { alertInstances.length  - 5 } more …</List.Header>
            </List.Content>
          </List.Item>
        }
      </List>
    )
  }
}