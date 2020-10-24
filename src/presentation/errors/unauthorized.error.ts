export class UnauthorizedError extends Error {
  constructor(
    more: string = ''
  ) {
    super(`Unauthorized. ${more}`.trim())
    this.name = 'UnauthorizedError'
  }
}
