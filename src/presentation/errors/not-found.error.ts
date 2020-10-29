export class NotFoundError extends Error {
  constructor(
    more: string = ''
  ) {
    super(`Not found. ${more || ''}`.trim())
    this.name = 'NotFoundError'
  }
}
