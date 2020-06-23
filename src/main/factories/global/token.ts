import { TokenAdapter } from '../../../data/protocols/token/token-adapter'
import { JWTAdapter } from '../../../infra/token/jwt-adapter'

const TOKEN_KEY = process.env.TOKEN_KEY || 'token_key'
const TOKEN_EXPIRATION = parseInt(process.env.TOKEN_EXPIRATION) || 3600

export const makeTokenAdapter = (): TokenAdapter => new JWTAdapter(TOKEN_KEY, TOKEN_EXPIRATION)
