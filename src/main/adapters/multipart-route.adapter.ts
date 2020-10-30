import { Request, Response } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import { v4 } from 'uuid'
import { serverError } from '../../presentation/helpers/http.helper'
import { IController } from '../../presentation/protocols/controller'
import { IHttpRequest, IHttpResponse } from '../../presentation/protocols/http'

type MulterErrorHandler = (req: Request, res: Response, cb: (err: Error | null) => void) => void
type multipartRouteAdapterReturn = (req: Request, res: Response) => void

export default (controller: IController, dest: string, fieldName: string = 'upload'): multipartRouteAdapterReturn => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }

  const storage = multer.diskStorage({
    destination: (
      _req: Request,
      _file: Express.Multer.File,
      callback: (error: Error | null, destination: string) => void) => {
      callback(null, dest)
    },
    filename: (
      _req: Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void
    ) => {
      const ext = path.extname(file.originalname).toLowerCase()
      const tempFileName = `${v4()}_${Date.now()}${ext}` // to cleanup expired files
      callback(null, tempFileName)
    }
  })

  const upload: MulterErrorHandler = multer({ storage }).single(fieldName)

  return async (req: Request, res: Response) => {
    let httpResponse: IHttpResponse

    await new Promise(resolve => {
      upload(req, res, (err: Error) => {
        if (err instanceof multer.MulterError) { // case have any error in Multer
          if (err.field) {
            httpResponse = serverError(`cannot find fieldName '${err.field}' in request`)
          }
          httpResponse = serverError('the request could not be understood')
          return resolve()
        }

        try {
          const { headers: header, body: multerBody, file: multerFile } = req

          let body = multerBody?.data

          if (typeof body === 'string') {
            body = JSON.parse(body)
          }

          const file = multerFile.path

          const httpRequest: IHttpRequest = { header, body, file }

          controller.handle(httpRequest)
            .then(res => {
              httpResponse = res
              resolve()
            })
            .catch((err) => { // case throw some unknown error in controller
              console.log(err)
              httpResponse = serverError()
              resolve()
            })
        } catch (error) { // case thro some error like JSON.parse
          httpResponse = serverError()
          resolve()
        }
      })
    })

    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}

