import { ValidationComposite, RequiredFieldsValidation, EmailValidation, CompareFieldsValidation } from '../../../presentation/validators'
import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldsValidation(field))
  }
  validations.push(new CompareFieldsValidation('passwordConfirmation', 'password'))

  const emailValidator = new EmailValidatorAdapter()
  validations.push(new EmailValidation('email', emailValidator))

  return new ValidationComposite(validations)
}
