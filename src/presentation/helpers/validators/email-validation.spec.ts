import { EmailValidation } from './email-validation'
import { EmailValidator } from '../../protocols/email-validator'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new EmailValidation('email', emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

const makeFakeInput = (): any => ({
  email: 'valid_email@email.com'
})

describe('Email Validation', () => {
  test('Should call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    await sut.validate(makeFakeInput())
    expect(isValidSpy).toHaveBeenCalledWith(makeFakeInput().email)
  })
})
