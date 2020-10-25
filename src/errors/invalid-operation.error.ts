export class InvalidOperationError extends Error {
  constructor(
    operationName: string,
    more: string = ''
  ) {
    super(`Invalid operation '${operationName}'. ${more}`.trim())
    this.name = 'InvalidOperationError'
  }
}
