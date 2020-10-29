import { NotFoundError } from './not-found.error'

describe('NotFoundError', () => {
  test('should return not found error', () => {
    const sut = new NotFoundError()
    expect(sut.message).toMatch(/Not found/)
  })

  test('should return not found error with more message if is passed', () => {
    const sut = new NotFoundError('more')
    expect(sut.message).toMatch(/more/)
  })
})
