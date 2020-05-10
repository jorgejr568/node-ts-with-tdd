import { makeSignUpValidation } from './signup-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation'
import { Validation } from '../../presentation/helpers/validators/validation'
import { EmailValidation } from '../../presentation/helpers/validators/email-validation'
import { CompareFieldsValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'

jest.mock('../../presentation/helpers/validators/validation-composite')

describe('SignUp Validation', () => {
  test('Should construct ValidationComposite with correct validations', async () => {
    makeSignUpValidation()

    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    validations.push(new CompareFieldsValidation('passwordConfirmation', 'password'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
