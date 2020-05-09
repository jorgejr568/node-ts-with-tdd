import { EmailValidatorAdapter } from './email-validator-adapter'
import { EmailValidator } from '../presentation/protocols/email-validator'

const makeSut = (): EmailValidator => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(sut, 'isValid').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_email@mail.com')
    expect(isValid).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(sut, 'isValid')

    sut.isValid('email@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('email@mail.com')
  })
})
