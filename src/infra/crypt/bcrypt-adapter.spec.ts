import { BcryptAdapter } from './bcrypt-adapter'
import bcrypt from 'bcrypt'

const salt = 12
const makeSut = (): BcryptAdapter => (new BcryptAdapter(salt))

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut()
    const bcryptHashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')
    expect(bcryptHashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return hash on success', async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'encrypt').mockReturnValueOnce(
      new Promise(resolve => resolve('hash')))

    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hash')
  })

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.encrypt('any_value')
    await expect(promise).rejects.toThrow()
  })

  test('Should call bcrypt compare with correct value', async () => {
    const sut = makeSut()
    const bcryptCompareSpy = jest.spyOn(bcrypt, 'compare')

    await sut.compare('any_value', 'hashed_value')
    expect(bcryptCompareSpy).toHaveBeenCalledWith('any_value', 'hashed_value')
  })

  test('Should return true on success', async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'compare').mockReturnValueOnce(
      new Promise(resolve => resolve(true)))

    const response = await sut.compare('any_value', 'hashed_value')

    expect(response).toBeTruthy()
  })

  test('Should throw if bcrypt compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(
      new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.compare('any_value', 'hashed_value')
    await expect(promise).rejects.toThrow()
  })
})
