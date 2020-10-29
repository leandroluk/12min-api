export class InvalidParamError extends Error {
  constructor(
    paramName: string,
    more: string = ''
  ) {
    super(`Invalid param '${paramName}'. ${more}`.trim())
    this.name = 'InvalidParamError'
  }
}
