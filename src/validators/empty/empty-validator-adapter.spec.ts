import { EmptyValidatorAdapter } from './empty-validator-adapter'

describe('NullValidator', () => {
  test('should return false if isn\'t empty', async () => {
    const sut = new EmptyValidatorAdapter()
    const invalid = [1, true, false, function () { }, (f: any) => f]
    for (const value of invalid) {
      await expect(sut.isEmpty(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if is empty', async () => {
    const sut = new EmptyValidatorAdapter()
    const valid = [undefined, null, '', {}, []]
    for (const value of valid) {
      await expect(sut.isEmpty(value)).resolves.toBeTruthy()
    }
  })
})
