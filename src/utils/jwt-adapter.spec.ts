import { JWTAdapter } from './jwt-adapter'
import { AuthenticatableModel } from '../presentation/protocols/token-adapter'
import jwt from 'jsonwebtoken'

const jwtKey = 'jwt_key'
const makeSut = (): JWTAdapter => (new JWTAdapter(jwtKey))

const makeFakeAuthenticatable = (): AuthenticatableModel => ({
  id: 'any_id',
  type: 'any_type'
})

describe('JWT Adapter', () => {
  test('Must call jsonwebtoken.sign with right value', async () => {
    const jwtSpy = jest.spyOn(jwt, 'sign')
    const authenticatable = makeFakeAuthenticatable()
    await makeSut().generate(authenticatable)

    expect(jwtSpy).toHaveBeenCalledWith(authenticatable, jwtKey)
  })
})
