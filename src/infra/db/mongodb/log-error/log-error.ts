import { LogErrorRepository } from '../../../../data/protocols/db/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogErrorMongoRepository implements LogErrorRepository {
  async log (stack: string): Promise<boolean> {
    const logsCollection = await MongoHelper.getCollection('log_errors')
    await logsCollection.insertOne({ stack: stack, date: new Date() })
    return new Promise(resolve => resolve(true))
  }
}
