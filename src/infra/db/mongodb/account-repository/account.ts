import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { AccountModel } from '../../../../domain/account-model'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const result = await MongoHelper.getCollection('accounts').insertOne(accountData)
    const account = result.ops[0]

    return new Promise(
      resolve => resolve(
        MongoHelper.map_IdtoId(account)
      )
    )
  }
}
