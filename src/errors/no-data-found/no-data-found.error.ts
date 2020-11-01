export class NoDataFoundError extends Error {
  constructor(
    more: string = ''
  ) {
    super(`No data found. ${more}`.trim())
    this.name = 'NoDataFoundError'
  }
}
