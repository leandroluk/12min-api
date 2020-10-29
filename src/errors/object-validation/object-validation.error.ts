export class ObjectValidationError extends Error {
  constructor(
    public readonly errors: any,
    more: string = ''
  ) {
    super(`Object validation error. ${more}`.trim())
    this.name = 'ObjectValidationError'
  }
}
