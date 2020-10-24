import { ObjectValidationError } from './object-validation.error'

describe('ObjectValidationError', () => {
  test('should return correct object validation error', () => {
    const sut = new ObjectValidationError({})
    expect(sut.message).toMatch(/Object validation error/)
  })

  test('should have object with errors if is passed on object validation error', () => {
    const errors = { any: 'error' }
    const sut = new ObjectValidationError(errors)
    expect(sut.errors).toEqual(errors)
  })
})
