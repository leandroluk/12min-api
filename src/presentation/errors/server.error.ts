export class ServerError extends Error {
  constructor(
    more: string = ''
  ) {
    super(`Server error. ${more}`.trim())
    this.name = 'ServerError'
  }
}
