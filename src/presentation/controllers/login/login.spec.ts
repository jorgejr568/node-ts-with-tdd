import { LoginController } from './login'
import { HttpRequest } from '../../protocols'
import { badRequest } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

interface SutTypes{
  sut: LoginController
  emailValidatorStub: EmailValidator
}
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

const makeFakeHttpRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_password'
  }
})
describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { body: { password } } = makeFakeHttpRequest()
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ body: { password } })
    const error = badRequest(new MissingParamError('email'))

    expect(httpResponse).toEqual(error)
  })

  test('Should return 400 if no password is provided', async () => {
    const { body: { email } } = makeFakeHttpRequest()
    const { sut } = makeSut()

    const httpResponse = await sut.handle({ body: { email } })
    const error = badRequest(new MissingParamError('password'))

    expect(httpResponse).toEqual(error)
  })

  test('Should return 400 if invalid Email provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    const error = badRequest(new InvalidParamError('email'))

    expect(httpResponse).toEqual(error)
  })
})
