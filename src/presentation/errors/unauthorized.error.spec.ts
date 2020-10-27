import { UnauthorizedError } from './unauthorized.error'

describe('UnauthorizedError', () => {
  test('should return unauthorized error', () => {
    const sut = new UnauthorizedError()
    expect(sut.message).toMatch(/Unauthorized/)
  })

  test('should return unauthorized error with more message if is passed', () => {
    const sut = new UnauthorizedError('more')
    expect(sut.message).toMatch(/more/)
  })
})
