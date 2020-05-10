import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/account-model'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { Collection } from 'mongodb'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  private readonly getCollection = async (): Promise<Collection> => {
    return await MongoHelper.getCollection('accounts')
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const collection = await this.getCollection()
    const result = await collection.insertOne(accountData)
    const account = result.ops[0]

    return new Promise(
      resolve => resolve(
        MongoHelper.map_IdtoId(account)
      )
    )
  }

  async load (email: string): Promise<AccountModel> {
    const collection = await this.getCollection()
    const account = await collection.findOne({ email })
    if (account) return MongoHelper.map_IdtoId(account)

    return null
  }
}
