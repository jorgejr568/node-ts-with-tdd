export interface AuthenticatableModel {
  type: string
  id: string
}

export interface TokenAdapter {
  generate (authenticatable: AuthenticatableModel): Promise<string>
}
