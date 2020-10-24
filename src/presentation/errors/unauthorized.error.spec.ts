import { UnauthorizedError } from './unauthorized.error'

const makeSut = (opts: any = {}): {
  sut: UnauthorizedError
} => {
  const { more = '' } = opts

  const sut = new UnauthorizedError(more)

  return {
    sut
  }
}

describe('UnauthorizedError', () => {
  test('should return message with more and space if is passed', () => {
    const { sut } = makeSut({ more: 'more' })
    expect(sut.message).toBe('Unauthorized. more')
  })
})
