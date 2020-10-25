import { ServerError } from './server.error'

describe('ServerError', () => {
  test('should return server error', () => {
    const sut = new ServerError()
    expect(sut.message).toMatch(/Server error/)
  })
  test('should return server error with more message if passed', () => {
    const sut = new ServerError('more')
    expect(sut.message).toMatch(/more/)
  })
})
