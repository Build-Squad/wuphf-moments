import { Item, Message, Icon, Label, Button } from 'semantic-ui-react'

export default function List(
  { alerts, onDelete }:
  { alerts: any[], onDelete: (nftId: number) => void }
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
          onDelete={ () => onDelete(alert.edition_id) }
        />) }
      </Item.Group>
    </>
  )
}


function OneAlert({ alert, onDelete }: { alert: any, onDelete: () => void }) {
  // TODO get the current price
  const current_price = Math.round(Math.random() * 1000 * 100) / 100

  return (
    <Item>
      <Item.Image size="tiny" src="/images/wireframe/image.png" alt="Media from the NFT"/>
      <Item.Content>
        <Button circular icon='delete' floated="right" onClick={ onDelete }/>
        <Item.Header 
          as="a"
          target="_blank"
          href={ `https://laligagolazos.com/editions/${ alert.edition_id }` }
        >Edition { alert.edition_id }</Item.Header>
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