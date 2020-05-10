import { LoginController } from './login'
import { HttpRequest } from '../../protocols'
import { badRequest, serverError, unauthorizedRequest } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Authentication } from '../../../domain/usecases/authentication'

interface SutTypes{
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}
const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('any_token'))
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const authenticationStub = new AuthenticationStub()
  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  test('Should return 500 if Email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeHttpRequest())
    const error = serverError()

    expect(httpResponse).toEqual(error)
  })

  test('Should call EmailValidator with correct values', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))

    const httpRequest = makeFakeHttpRequest()
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorizedRequest())
  })
})
