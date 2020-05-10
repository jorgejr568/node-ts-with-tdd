import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'
import { serverError } from '../../presentation/helpers'
import { LogErrorRepository } from '../../data/protocols/log-error-repository'

interface SutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
  logErrorRepositoryStub: LogErrorRepository
}
const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve({ statusCode: 200, body: httpRequest.body }))
    }
  }
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<boolean> {
      return new Promise(resolve => resolve(true))
    }
  }

  const controllerStub = new ControllerStub()
  const logErrorRepositoryStub = new LogErrorRepositoryStub()
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    controllerStub,
    sut,
    logErrorRepositoryStub
  }
}
describe('LogControllerDecorator', () => {
  test('Should call controller handle with correct params', async () => {
    const { sut, controllerStub } = makeSut()
    const spyControllerStubHandle = jest.spyOn(controllerStub, 'handle')
    await sut.handle({
      body: {
        foo: 'bar'
      }
    })

    expect(spyControllerStubHandle).toHaveBeenCalledWith({
      body: {
        foo: 'bar'
      }
    })
  })

  test('Should return same controller handle response', async () => {
    const { sut, controllerStub } = makeSut()
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve({ statusCode: 200, body: { mocked: true } }))
    )
    const httpResponse = await sut.handle({
      body: {
        foo: 'bar'
      }
    })

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {
        mocked: true
      }
    })
  })

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    const error = serverError(fakeError)
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(error))
    )
    const spyLogErrorRepositoryStub = jest.spyOn(logErrorRepositoryStub, 'log')
    await sut.handle({
      body: {
        foo: 'bar'
      }
    })
    expect(spyLogErrorRepositoryStub).toHaveBeenCalledWith(fakeError.stack)
  })
})
