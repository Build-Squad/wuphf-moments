export type User = {
  f_type?: string
  f_vsn?: string
  addr: string | null
  cid: string | null
  loggedIn: boolean | null
  expiresAt: number | null
  services: any[] | null
}