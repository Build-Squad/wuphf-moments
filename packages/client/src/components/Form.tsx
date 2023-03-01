import React from 'react'
import { Form, Button, Message, Input, Icon } from 'semantic-ui-react'

import type { FormEvent } from 'react'


const URL_PATTERN = /^https:\/\/laligagolazos\.com\/editions\/(\d+)$/

export default function AppForm(
  { onAlertCreate }:
  { onAlertCreate: (formPayload: any) => void}
) {

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const url = formData.get('edition') as string
    if (!URL_PATTERN.test(url)) {
      console.error(`${url} doens't match ${URL_PATTERN.source}'`)
    } else {
      onAlertCreate({
        edition_id: parseInt(URL_PATTERN.exec(url)![1]),
        min_price: parseFloat(formData.get('price') as string),
        email: formData.get('email')
      })
    }
  }

  return (
    <>
      <Message attached icon>
        <Icon name="alarm" />
        <Message.Content>
          <Message.Header as="h2">
            Setup a price alert for a Moment NFT
          </Message.Header>
          <p>
            Go to&nbsp;
            <a href="https://laligagolazos.com/marketplace/moments" target="_blank">
              LaLiga Golazos&nbsp;
              <Icon name='external' size='small' />
            </a>,
            find an Edition you want to track and setup an alert with its url.
          </p>
        </Message.Content>
      </Message>
      <Form className="attached segment" onSubmit={ handleSubmit } method="POST">
        <Form.Field>
          <label htmlFor="edition">Edition URL</label>
          <Input 
            type="text" name="edition" id="edition"
            placeholder="https://laligagolazos.com/editions/0000"
            pattern={ URL_PATTERN.source } required={ true } 
            icon="barcode" iconPosition="left" 
          />
        </Form.Field>
        <Form.Field>
          <label htmlFor="price">Min. price</label>
          <Input 
            type="number" name="price" id="price"
            step="0.01" min="0"  placeholder="0.0" required={ true }
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