import { AuthenticatableModel, TokenAdapter } from '../presentation/protocols/token-adapter'
import jwt from 'jsonwebtoken'

export class JWTAdapter implements TokenAdapter {
  private readonly key: string
  private readonly expiration: number

  constructor (key: string, expiration: number) {
    this.key = key
    this.expiration = expiration
  }

  async encode (authenticatable: AuthenticatableModel): Promise<string> {
    return new Promise(resolve => resolve(
      jwt.sign(authenticatable, this.key, { expiresIn: this.expiration }))
    )
  }

  async decode (token: string): Promise<AuthenticatableModel> {
    const jwtDecoded: any = jwt.verify(token, this.key)
    const authenticatable: AuthenticatableModel = { id: jwtDecoded.id }
    return new Promise(resolve => resolve(authenticatable))
  }
}
