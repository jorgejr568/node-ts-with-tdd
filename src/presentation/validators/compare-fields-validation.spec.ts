import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '../errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('anyConfirmationField', 'anyField')
}

const makeFakeInput = (): any => ({
  anyField: 'any_value',
  anyConfirmationField: 'any_value'
})

describe('Compare Fields Validation', () => {
  test('Should return null if valid data provided', async () => {
    const sut = makeSut()
    const error = await sut.validate(makeFakeInput())
    expect(error).toBeFalsy()
  })

  test('Should return InvalidParamError with anyConfirmationField if invalid data provided', async () => {
    const sut = makeSut()
    const { anyField } = makeFakeInput()
    const error = await sut.validate(Object.assign({ anyField }, { anyConfirmationField: 'invalid_value' }))
    expect(error).toEqual(new InvalidParamError('anyConfirmationField'))
  })
})
