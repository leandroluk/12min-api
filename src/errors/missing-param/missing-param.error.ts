export class MissingParamError extends Error {
  constructor(
    paramName: string,
    more: string = ''
  ) {
    super(`Missing param '${paramName}'. ${more}`.trim())
    this.name = 'MissingParamError'
  }
}
