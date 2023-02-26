import React from 'react'
import { Form, Button, Message, Input, Icon } from 'semantic-ui-react'

import type { FormEvent } from 'react'

export default function AppForm(
  { onAlertCreate }:
  { onAlertCreate: (formPayload: any) => void}
) {
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    onAlertCreate({
      edition_id: formData.get('edition'),
      min_price: formData.get('price'),
      email: formData.get('email')
    })
  }
  
  return (
    <>
      <Message attached icon>
        <Icon name="alarm" />
        <Message.Content>
          <Message.Header as="h2">
            Setup an alert price for a Moment NFT
          </Message.Header>
          <p>blah</p>
        </Message.Content>
      </Message>
      <Form className="attached segment" onSubmit={ handleSubmit } method="POST">
        <Form.Field>
          <label htmlFor="edition">Edition Id</label>
          <Input 
            type="text" name="edition" id="edition"
            placeholder="0000"
            icon="barcode" iconPosition="left" 
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="price">Price threshold</label>
          <Input 
            type="number" name="price" id="price"
            step="0.01" min="0"  placeholder="0.0"
            icon="dollar" iconPosition="left" 
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="email">Email to notify</label>
          <Input 
            type="email" name="email" id="email"
            placeholder="dude@ho.me"
            icon="address card" iconPosition="left"
          />
        </Form.Field>
        <Button type="submit">Submit</Button>
      </Form>
    </>
  )
}