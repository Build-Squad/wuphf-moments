export type User = {
  f_type?: string
  f_vsn?: string
  addr: string | null
  cid: string | null
  loggedIn: boolean | null
  expiresAt: number | null
  services: any[] | null
}

export type Alert = {
  edition_id: number,
  address: string,
  min_price: number
  email: string
}

export type AlertInstance = {
  nft_id: number,
  sale_price: number
  serial_number: number
}