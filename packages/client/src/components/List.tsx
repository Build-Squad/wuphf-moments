import { Item, Message, Icon, Label } from 'semantic-ui-react'

export default function List() {
  return (
    <>
      <Message attached icon>
        <Icon name="list" />
        <Message.Content>
          <Message.Header as="h2">
            Your active alerts
          </Message.Header>
          <p>placeholder data below</p>
        </Message.Content>
      </Message>
      <Item.Group divided className="attached segment">
        <Item>
          <Item.Image size="tiny" src="/images/wireframe/image.png" />
          <Item.Content>
            <Item.Header as="a">NFT name A</Item.Header>
            <Item.Meta>
              <Label>
                <Icon name="dollar" />25
                <Label.Detail>Alert price</Label.Detail>
              </Label>
              <Label color="green">
                <Icon name="dollar"/>20
                <Label.Detail>Current price</Label.Detail>
              </Label>
            </Item.Meta>
            <Item.Description>
            </Item.Description>
            <Item.Description>Additional Details from the NFT data</Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Image size="tiny" src="/images/wireframe/image.png" />
          <Item.Content>
            <Item.Header as="a">NFT name B</Item.Header>
            <Item.Meta>
              <Label>
                <Icon name="dollar" />
                30
                <Label.Detail>Alert price</Label.Detail>
              </Label>
              <Label color="red">
                <Icon name="dollar"/>
                40
                <Label.Detail>Current price</Label.Detail>
              </Label>
            </Item.Meta>
            <Item.Description>Additional Details from the NFT data</Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </>
  )
}