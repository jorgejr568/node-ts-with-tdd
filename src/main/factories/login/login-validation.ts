import { ValidationComposite, RequiredFieldsValidation, EmailValidation } from '../../../presentation/validators'
import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
