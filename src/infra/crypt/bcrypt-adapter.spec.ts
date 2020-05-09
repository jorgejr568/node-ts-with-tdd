import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const makeSut = (): BcryptAdapter => (new BcryptAdapter(12))

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')
    expect(bcryptHashSpy).toHaveBeenCalledWith('any_value', 12)
  })

  test('Should return hash on success', async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'encrypt').mockReturnValueOnce(
      new Promise(resolve => resolve('hash')))

    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hash')
  })
})
