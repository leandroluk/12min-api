export class EmailInUseError extends Error {
  constructor(
    email: string
  ) {
    super(`Email '${email}' in use.`)
    this.name = 'EmailInUseError'
  }
}
