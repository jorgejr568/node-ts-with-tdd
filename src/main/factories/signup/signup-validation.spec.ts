import { ValidationComposite, EmailValidation, CompareFieldsValidation, RequiredFieldsValidation } from '../../../presentation/validators'
import { Validation } from '../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { makeSignUpValidation } from './signup-validation'

jest.mock('../../../presentation/validators/validation-composite')

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
