import { AccountModel } from '../../domain/account-model'

export interface LoadAccountByEmailRepository {
  load (email: string): Promise<AccountModel>
}
