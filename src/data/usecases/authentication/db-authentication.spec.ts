import { AccountModel } from '../../../domain/account-model'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { DbAuthentication } from './db-authentication'
import { AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashCompare } from '../../protocols/crypt/hash-compare'
import { AuthenticatableModel, TokenAdapter } from '../../protocols/token/token-adapter'

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  sut: DbAuthentication
  tokenAdapterStub: TokenAdapter
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeFakeAuthenticatableModel = (): AuthenticatableModel => ({
  id: 'any_id'
})

const makeSut = (): SutTypes => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account: AccountModel = makeFakeAccount()
      return new Promise(resolve => resolve(account))
    }
  }
  class HashCompareStub implements HashCompare {
    async compare (data: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }
  class TokenAdapterStub implements TokenAdapter {
    async encode (authenticatable: AuthenticatableModel): Promise<string> {
      return new Promise(resolve => resolve('token'))
    }

    async decode (token: string): Promise<AuthenticatableModel> {
      return new Promise(resolve => resolve(makeFakeAuthenticatableModel()))
    }
  }

  const tokenAdapterStub = new TokenAdapterStub()
  const hashCompareStub = new HashCompareStub()
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenAdapterStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenAdapterStub
  }
}
describe('DB Authentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe(null)
  })

  test('Should pass the right value to HashCompare', async () => {
    const { sut, hashCompareStub } = makeSut()
    const hashCompareSpy = jest.spyOn(hashCompareStub, 'compare')

    await sut.auth(makeFakeAuthentication())
    expect(hashCompareSpy).toHaveBeenCalledWith(makeFakeAuthentication().password, makeFakeAccount().password)
  })

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))

    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe(null)
  })

  test('Should return accessToken if HashCompare returns true', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(true)))

    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeTruthy()
  })

  test('Should call encode with correct params', async () => {
    const { sut, tokenAdapterStub } = makeSut()
    const tokenSpy = jest.spyOn(tokenAdapterStub, 'encode')

    await sut.auth(makeFakeAuthentication())
    expect(tokenSpy).toHaveBeenCalledWith(makeFakeAuthenticatableModel())
  })
})
