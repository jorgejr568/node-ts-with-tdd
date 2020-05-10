import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'
import { badRequest, okResponse, serverError, unauthorizedRequest } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }
      const { email, password } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) return badRequest(new InvalidParamError('email'))

      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) return unauthorizedRequest()

      return new Promise(resolve => resolve(okResponse({ accessToken })))
    } catch (error) {
      return serverError(error)
    }
  }
}
