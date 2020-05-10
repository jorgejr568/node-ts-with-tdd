import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { HashCompare } from '../../protocols/crypt/hash-compare'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository, hashCompare: HashCompare) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    let accessToken = null
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValidPassword = await this.hashCompare.compare(authentication.password, account.password)
      if (isValidPassword) accessToken = 'any_token'
    }
    return new Promise(resolve => resolve(accessToken))
  }
}
