import { NoDataFoundError } from './no-data-found.error'

describe('NoDataFoundError', () => {
  test('should return correct no data found error message', () => {
    const sut = new NoDataFoundError()
    expect(sut.message).toMatch(/No data found./)
  })

  test('should return no data found error message with more info after it', () => {
    const sut = new NoDataFoundError('more')
    expect(sut.message).toMatch(/more/)
  })
})

