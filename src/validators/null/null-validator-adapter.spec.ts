import { NullValidatorAdapter } from './null-validator-adapter'

describe('NullValidatorAdapter', () => {
  test('should return false if isn\'t null', async () => {
    const sut = new NullValidatorAdapter()
    const invalid = ['', 1, true, false, {}, [], function () { }, (f: any) => f]
    for (const value of invalid) {
      await expect(sut.isNull(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if is an empty string, undefined or null', async () => {
    const sut = new NullValidatorAdapter()
    const valid = [undefined, null]
    for (const value of valid) {
      await expect(sut.isNull(value)).resolves.toBeTruthy()
    }
  })
})
