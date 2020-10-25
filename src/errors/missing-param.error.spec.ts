import { MissingParamError } from './missing-param.error'

describe('MissingParamError', () => {
  test('should return correct missing param error message', () => {
    const sut = new MissingParamError('param')
    expect(sut.message).toMatch(/Missing param/)
  })

  test('should return missing param error message with more info after it', () => {
    const sut = new MissingParamError('param', 'more')
    expect(sut.message).toMatch(/more/)
  })
})

