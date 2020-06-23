import { JWTAdapter } from './jwt-adapter'
import { AuthenticatableModel } from '../../data/protocols/token/token-adapter'
import jwt from 'jsonwebtoken'

const jwtKey = 'jwt_key'
const expiration = 60 * 60
const makeSut = (): JWTAdapter => (new JWTAdapter(jwtKey, expiration))

const makeFakeAuthenticatable = (): AuthenticatableModel => ({
  id: 'any_id'
})

describe('JWT Adapter', () => {
  test('Must call jsonwebtoken.sign with right value', async () => {
    const jwtSpy = jest.spyOn(jwt, 'sign')
    const authenticatable = makeFakeAuthenticatable()
    await makeSut().encode(authenticatable)

    expect(jwtSpy).toHaveBeenCalledWith(authenticatable, jwtKey, { expiresIn: expiration })
  })

  test('Must throw when jsonwebtoken.sign throws', async () => {
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const authenticatable = makeFakeAuthenticatable()
    const promise = makeSut().encode(authenticatable)

    await expect(promise).rejects.toThrow()
  })

  test('Must call jsonwebtoken.verify with right value', async () => {
    const jwtSpy = jest.spyOn(jwt, 'verify')
    const authenticatable = makeFakeAuthenticatable()
    const token = await makeSut().encode(authenticatable)
    await makeSut().decode(token)
    expect(jwtSpy).toHaveBeenCalledWith(token, jwtKey)
  })

  test('Must throw when jsonwebtoken.verify throws', async () => {
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error()
    })

    const token = await makeSut().encode(makeFakeAuthenticatable())
    const promise = makeSut().decode(token)
    await expect(promise).rejects.toThrow()
  })
})
