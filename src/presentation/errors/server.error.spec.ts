import { ServerError } from './server.error'

const makeSut = (opts: any = {}): {
  sut: ServerError
} => {
  const { more = '' } = opts

  const sut = new ServerError(more)

  return {
    sut
  }
}

describe('ServerError', () => {
  test('should return message with more and space if is passed', () => {
    const { sut } = makeSut({ more: 'more' })
    expect(sut.message).toBe('Server error. more')
  })
})
