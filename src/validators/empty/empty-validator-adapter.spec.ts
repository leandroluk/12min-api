import { EmptyValidatorAdapter } from './empty-validator-adapter'

describe('EmptyValidatorAdapter', () => {
  test('should return false if not empty', async () => {
    const sut = new EmptyValidatorAdapter()
    const invalid = [1, 1.1, true, function () { }, (f: any) => f]
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

  test('should return false if Object.keys throws', async () => {
    const sut = new EmptyValidatorAdapter()
    jest.spyOn(Object, 'keys').mockImplementationOnce(() => { throw new Error() })
    const result = await sut.isEmpty({})
    expect(result).toBeFalsy()
  })
})
