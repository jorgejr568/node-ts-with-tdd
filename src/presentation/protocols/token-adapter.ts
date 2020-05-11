export interface AuthenticatableModel {
  id: string
}

export interface TokenAdapter {
  encode (authenticatable: AuthenticatableModel): Promise<string>
  decode (token: string): Promise<AuthenticatableModel>
}
