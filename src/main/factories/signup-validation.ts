import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

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
