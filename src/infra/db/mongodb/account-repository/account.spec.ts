import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

const makeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password'
})

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    const sut = makeSut()

    const account = await sut.add(makeAccountData())

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email')
    expect(account.password).toBe('hashed_password')
  })

  test('Should return null when cannot find the account', async () => {
    const sut = makeSut()
    const account = await sut.load(makeAccountData().email)

    expect(account).toBe(null)
  })

  test('Should return an Account on success load account', async () => {
    const sut = makeSut()
    const accountData = makeAccountData()
    const accountModel = await sut.add(accountData)
    const account = await sut.load(accountData.email)

    expect(account).toEqual(accountModel)
  })
})
