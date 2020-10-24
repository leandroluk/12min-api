import { ErrorAdapter } from './error.adapter'

const makeTestError = (): Error => {
  class TestError extends Error {
    constructor(
      readonly foo: string,
      readonly bar: string
    ) {
      super('TestError')
      this.name = 'TestError'
      delete this.stack
    }
  }
  return new TestError('foo', 'bar')
}

const makeSut = (): {
  testError: Error
  sut: ErrorAdapter
} => {
  const testError = makeTestError()
  const sut = new ErrorAdapter(testError)

  return {
    testError,
    sut
  }
}

const testErrorMock = {
  message: 'TestError',
  foo: 'foo',
  bar: 'bar',
  name: 'TestError'
}

describe('ErrorAdapter', () => {
  test('should transform erro into json object with only public properties', () => {
    const { sut } = makeSut()

    const result = sut.toJSON()

    expect(result).toEqual(testErrorMock)
  })

  test('should create a generic error comparable using instanceof', () => {
    const { sut } = makeSut()
    sut.fromJSON(testErrorMock)

    expect(sut.data.name).toEqual('TestError')
  })
})
