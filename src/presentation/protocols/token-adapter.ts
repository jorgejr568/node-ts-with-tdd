export interface AuthenticatableModel {
  type: string
  id: string
}

export interface TokenAdapter {
  encode (authenticatable: AuthenticatableModel): Promise<string>
  decode (token: string): Promise<AuthenticatableModel>
}
