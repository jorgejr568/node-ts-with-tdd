import { HttpRequest, HttpResponse, Controller, EmailValidator } from './signup-protocols'
import { InvalidParamError } from '../../errors'
import { badRequest, okResponse, serverError } from '../../helpers'
import { AddAccount } from '../../../domain/usecases/add-account'
import { Validation } from '../../helpers/validators/validation'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount
  private readonly validation: Validation

  constructor (emailValidator: EmailValidator, addAccount: AddAccount, validation: Validation) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body)
      if (error) return badRequest(error)

      const { name, email, password, passwordConfirmation } = httpRequest.body

      const passwordEqualsToPasswordConfirmation = password === passwordConfirmation
      if (!passwordEqualsToPasswordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValidEmail = this.emailValidator.isValid(email)
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return okResponse(account)
    } catch (error) {
      return serverError(error)
    }
  }
}
