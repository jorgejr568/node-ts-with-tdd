import { Validation } from '../protocols/validation'
import { MissingParamError } from '../errors'

export class RequiredFieldsValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  async validate (input: any): Promise<Error> {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName)
  }
}
