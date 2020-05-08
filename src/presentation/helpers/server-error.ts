import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors/server-error'

export const serverError = (): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}
