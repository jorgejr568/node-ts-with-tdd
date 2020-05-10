import { HttpResponse } from '../protocols/http'
import { ServerError } from '../errors/server-error'

export const serverError = (error: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error)
  }
}
