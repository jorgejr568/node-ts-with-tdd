import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { HashCompare } from '../../protocols/crypt/hash-compare'
import { TokenAdapter } from '../../protocols/token/token-adapter'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenAdapter: TokenAdapter

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashCompare, tokenAdapter: TokenAdapter) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenAdapter = tokenAdapter
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    let accessToken = null
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValidPassword = await this.hashCompare.compare(authentication.password, account.password)
      if (isValidPassword) accessToken = this.tokenAdapter.encode({ id: account.id })
    }
    return new Promise(resolve => resolve(accessToken))
  }
}
