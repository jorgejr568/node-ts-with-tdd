import { Validation } from '../../../presentation/protocols'
import { ValidationComposite, EmailValidation, RequiredFieldsValidation } from '../../../presentation/validators'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/validators/validation-composite')

describe('Login Validation', () => {
  test('Should construct ValidationComposite with correct validations', async () => {
    makeLoginValidation()
    const validations: Validation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldsValidation(field))
    }
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
