import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { Request, Response } from 'express'

interface ExceptionResponseInterface {
  error: string
}

const adaptExceptionToResponse = (error: Error): ExceptionResponseInterface => ({
  error: error.message
})

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const response: HttpResponse = await controller.handle(httpRequest)
    res.status(response.statusCode)

    if (response.statusCode === 200) {
      res.json(response.body)
    } else res.json(adaptExceptionToResponse(response.body))
  }
}
