import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, okResponse, serverError } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'
import { Authentication } from '../../../domain/usecases/authentication'

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

      const token = await this.authentication.auth(email, password)
      return new Promise(resolve => resolve(okResponse({ token })))
    } catch (error) {
      return serverError(error)
    }
  }
}
