import { InvalidOperationError } from './invalid-operation.error'

describe('InvalidOperationError', () => {
  test('should return correct invalid operation error message', () => {
    const sut = new InvalidOperationError('param')
    expect(sut.message).toMatch(/Invalid operation/)
  })

  test('should return invalid operation error message with more info after it', () => {
    const sut = new InvalidOperationError('param', 'more')
    expect(sut.message).toMatch(/more/)
  })
})
