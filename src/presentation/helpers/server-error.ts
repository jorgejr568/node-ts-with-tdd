import { HttpResponse } from '../protocols'
import { ServerError } from '../errors'

export const serverError = (error?: Error): HttpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error)
  }
}
