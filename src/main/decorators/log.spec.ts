import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { LogControllerDecorator } from './log'

interface SutTypes {
  controllerStub: Controller
  sut: LogControllerDecorator
}
const makeSut = (): SutTypes => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve({ statusCode: 200, body: httpRequest.body }))
    }
  }

  const controllerStub = new ControllerStub()
  const sut = new LogControllerDecorator(controllerStub)

  return {
    controllerStub,
    sut
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
})
