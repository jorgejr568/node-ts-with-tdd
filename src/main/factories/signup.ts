import { SignUpController } from '../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/crypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'
import { LogErrorMongoRepository } from '../../infra/db/mongodb/log-error/log-error'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const SALT = 12
  const bcryptAdapter = new BcryptAdapter(SALT)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository)
  const signUpValidation = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, signUpValidation)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
