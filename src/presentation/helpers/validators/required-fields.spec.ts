import { MissingParamError } from '../../errors'
import { RequiredFieldsValidation } from './required-fields-validation'

const makeSut = (): RequiredFieldsValidation => {
  return new RequiredFieldsValidation('anyField')
}

const makeFakeInput = (): any => ({
  anyField: 'any_value'
})

describe('Required Fields Validation', () => {
  test('Should return null if valid data provided', async () => {
    const sut = makeSut()
    const error = await sut.validate(makeFakeInput())
    expect(error).toBeFalsy()
  })

  test('Should return MissingParamError with anyField if invalid data provided', async () => {
    const sut = makeSut()
    const invalidHttpRequest = {}
    const error = await sut.validate(invalidHttpRequest)
    expect(error).toEqual(new MissingParamError('anyField'))
  })
})
