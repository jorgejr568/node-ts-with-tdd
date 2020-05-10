import { ValidationComposite } from './'
import { Validation } from '../protocols'

interface SutTypes {
  sut: ValidationComposite
  validationStub: Validation
  errorStub: Error
}

const makeSut = (): SutTypes => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Error> {
      return new Promise(resolve => resolve(null))
    }
  }

  class ErrorStub extends Error {}

  const errorStub = new ErrorStub()
  const validationStub = new ValidationStub()
  const sut = new ValidationComposite([validationStub])
  return {
    sut,
    validationStub,
    errorStub
  }
}

describe('Validation Composite', () => {
  test('Should return null if pass through validations', async () => {
    const { sut } = makeSut()
    const error = await sut.validate({})
    expect(error).toBeFalsy()
  })

  test('Should return Error with same class that was returned if invalid data provided', async () => {
    const { sut, validationStub, errorStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Promise(resolve => resolve(errorStub)))
    const error = await sut.validate({})

    expect(error).toEqual(errorStub)
  })
})
