import { Request, Response } from 'express'
import { IController } from '../../presentation/protocols/controller'
import { IHttpRequest } from '../../presentation/protocols/http'

export default (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequest = {
      header: req.headers,
      body: typeof req.body === 'object' ? req.body : JSON.parse(req.body),
      file: req.file
    }

    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
