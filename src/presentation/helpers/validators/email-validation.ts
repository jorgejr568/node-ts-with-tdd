import { Validation } from './validation'
import { InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols/email-validator'

export class RequiredFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  async validate (input: any): Promise<Error> {
    if (!this.emailValidator.isValid(input[this.fieldName])) return new InvalidParamError(this.fieldName)
  }
}
