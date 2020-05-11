import { AuthenticatableModel, TokenAdapter } from '../presentation/protocols/token-adapter'
import jwt from 'jsonwebtoken'

export class JWTAdapter implements TokenAdapter {
  private readonly key: string

  constructor (key: string) {
    this.key = key
  }

  async generate (authenticatable: AuthenticatableModel): Promise<string> {
    return new Promise(resolve => resolve(jwt.sign(authenticatable, this.key)))
  }
}
