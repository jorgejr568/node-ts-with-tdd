import { Authentication, Controller, HttpRequest, HttpResponse } from './login-protocols'
import { badRequest, okResponse, serverError, unauthorizedRequest } from '../../helpers'
import { Validation } from '../../protocols'

export class LoginController implements Controller {
  private readonly authentication: Authentication
  private readonly validation: Validation

  constructor (authentication: Authentication, validation: Validation) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })
      if (!accessToken) return unauthorizedRequest()

      return new Promise(resolve => resolve(okResponse({ accessToken })))
    } catch (error) {
      return serverError(error)
    }
  }
}
