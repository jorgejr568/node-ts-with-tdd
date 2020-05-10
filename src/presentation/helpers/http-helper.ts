import { HttpResponse } from '../protocols/http'
import { UnauthorizedError } from '../errors/unauthorized-error'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorizedRequest = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const okResponse = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
