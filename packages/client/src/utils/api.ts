import { Buffer } from 'buffer'
import { getFclConfiguration } from '../utils/FclConfig'

const commonHeaders = new Headers({
  'Content-Type': 'application/json'
})

const fcl = getFclConfiguration()

export const fetchAlerts = async (userAddress: string) => {
  const response = await fetch(`${process.env.REACT_APP_API_BASE}/${userAddress}`, {
    headers: commonHeaders
  })
  if (response.ok) {
    const json = await response.json()
    return json.alerts
  } else {
    throw response
  }
}

export const deleteAlert = async (userAddress: string, editionId: number) => {
  const response = await fetch(`${process.env.REACT_APP_API_BASE}/${editionId}/${userAddress}`, {
    method: 'DELETE',
    headers: commonHeaders
  })
  if (!response.ok) {
    throw response
  }
}

export const createAlert = async (userAddress: string, formPayload: any) => {
  // TODO asks the user to sign it
  const payload = { address: userAddress, ...formPayload }
  const unsigned_msg = Buffer.from(JSON.stringify(payload)).toString('hex')
  const signatures = await fcl.currentUser.signUserMessage(unsigned_msg)
  
  const response = await fetch(`${process.env.REACT_APP_API_BASE}/`, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify({ payload, signatures })
  })
  if(!response.ok) {
    throw response
  }
}
