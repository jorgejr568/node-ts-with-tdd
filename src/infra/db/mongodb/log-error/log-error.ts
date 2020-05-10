import { LogErrorRepository } from '../../../../data/protocols/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<boolean> {
    const logsCollection = await MongoHelper.getCollection('logs')
    await logsCollection.insertOne({ stack: stack, now: new Date() })
    return new Promise(resolve => resolve(true))
  }
}
