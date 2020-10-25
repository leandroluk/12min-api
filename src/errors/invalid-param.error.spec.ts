import { InvalidParamError } from './invalid-param.error'

describe('InvalidParamError', () => {
  test('should return correct invalid param error message', () => {
    const sut = new InvalidParamError('param')
    expect(sut.message).toMatch(/Invalid param/)
  })

  test('should return invalid param error message with more info after it', () => {
    const sut = new InvalidParamError('param', 'more')
    expect(sut.message).toMatch(/more/)
  })
})
