import { AddAccount, AddAccountModel, Encrypter, AddAccountRepository } from './db-add-account-protocols'
import { AccountModel } from '../../../domain/account-model'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter
  private readonly addAccountRepository: AddAccountRepository

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    account.password = await this.encrypter.encrypt(account.password)

    const accountModel = await this.addAccountRepository.add(account)
    return new Promise(resolve => resolve(accountModel))
  }
}
