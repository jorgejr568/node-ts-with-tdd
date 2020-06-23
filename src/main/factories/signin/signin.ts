import { SignInController } from '../../../presentation/controllers/signin/signin'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log'
import { LogErrorMongoRepository } from '../../../infra/db/mongodb/log-error/log-error'
import { makeSignInValidation } from './signin-validation'
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { makeHashCompare, makeTokenAdapter } from '../global'

export const makeSignInController = (): Controller => {
  const loadAccountRepository = new AccountMongoRepository()
  const dbAuthentication = new DbAuthentication(loadAccountRepository, makeHashCompare(), makeTokenAdapter())
  const signInValidation = makeSignInValidation()
  const signInController = new SignInController(dbAuthentication, signInValidation)
  const logErrorRepository = new LogErrorMongoRepository()
  return new LogControllerDecorator(signInController, logErrorRepository)
}
