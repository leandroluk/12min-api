export enum HttpStatusCode {
  ok = 200,
  badRequest = 400,
  unauthorized = 401,
  notFound = 404,
  serverError = 500
}

export interface IHttpResponse<THeader = any, TBody = any> {
  statusCode: number
  header?: THeader
  body: TBody
}

export interface IHttpRequest<Header = any, Body = any, File = any, Params = any, Query = any> {
  header?: Header
  body?: Body
  file?: File
  params?: Params
  query?: Query
}
