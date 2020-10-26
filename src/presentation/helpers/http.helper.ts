import { ErrorAdapter } from '../adapters/error.adapter'
import { ServerError } from '../errors/server.error'
import { HttpStatusCode, IHttpResponse } from '../protocols/http'

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: HttpStatusCode.badRequest,
  header: {},
  body: new ErrorAdapter(error).toJSON()
})

export const unauthorized = (error: Error): IHttpResponse => ({
  statusCode: HttpStatusCode.unauthorized,
  header: {},
  body: new ErrorAdapter(error).toJSON()
})

export const serverError = (): IHttpResponse => ({
  statusCode: HttpStatusCode.serverError,
  header: {},
  body: new ErrorAdapter(new ServerError()).toJSON()
})

export const ok = <H = any, B = any>(body: B, header: H = {} as any): IHttpResponse<H, B> => ({
  statusCode: HttpStatusCode.ok,
  header,
  body
})
