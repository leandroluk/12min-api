import { Request, Response } from 'express'
import { IController } from '../../presentation/protocols/controller'
import { IHttpRequest } from '../../presentation/protocols/http'

export const adaptJsonRoute = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequest = {
      header: req.headers,
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}