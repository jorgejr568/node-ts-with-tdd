import { MongoHelper } from '../helpers/mongo-helper'
import { LogErrorMongoRepository } from './log-error'
import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'

const makeSut = (): LogErrorRepository => {
  return new LogErrorMongoRepository()
}

describe('LogError Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('logs')
    await collection.deleteMany({})
  })

  test('Is logging stack error', async () => {
    const fakeError = new Error('Testing logError')
    const sut = makeSut()

    const inserted = await sut.log(fakeError.stack)

    expect(inserted).toBeTruthy()
  })
})
