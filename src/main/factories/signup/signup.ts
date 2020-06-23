import { SignUpController } from '../../../presentation/controllers/signup/signup'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-error/log-error'
import { makeSignUpValidation } from './signup-validation'
import { makeHashEncrypter } from '../global'

export const makeSignUpController = (): Controller => {
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(makeHashEncrypter(), addAccountRepository)
  const signUpValidation = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, signUpValidation)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signUpController, logErrorRepository)
}
