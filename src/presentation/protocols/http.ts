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

export interface IHttpRequest<THeader = any, TBody = any> {
  header?: THeader
  body?: TBody
}
