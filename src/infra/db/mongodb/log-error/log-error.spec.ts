import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorMongoRepository } from './log-error'
import { LogErrorRepository } from '../../../../data/protocols/db/log-error-repository'

const makeSut = (): LogErrorRepository => {
  return new LogErrorMongoRepository()
}

describe('LogError Mongo Repository', () => {
  let errorCollection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('log_errors')
    await errorCollection.deleteMany({})
  })

  test('Should return true on success logging', async () => {
    const fakeError = new Error('Testing logError')
    const sut = makeSut()

    const inserted = await sut.log(fakeError.stack)

    expect(inserted).toBeTruthy()
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.log('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
