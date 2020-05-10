import { Validation } from './validation'
import { InvalidParamError } from '../../errors'

export class RequiredFieldsValidation implements Validation {
  private readonly fieldName: string
  private readonly fieldToCompareName: string

  constructor (fieldName: string, fieldToCompareName: string) {
    this.fieldName = fieldName
    this.fieldToCompareName = fieldToCompareName
  }

  async validate (input: any): Promise<Error> {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) return new InvalidParamError(this.fieldName)
  }
}
