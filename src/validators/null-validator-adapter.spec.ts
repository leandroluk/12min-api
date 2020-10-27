import { INullValidator } from '../presentation/protocols/null-validator'
import { NullValidatorAdapter } from './null-validator-adapter'

const makeSut = (): {
  sut: INullValidator
  invalidTypes: any[]
  validTypes: any[]
} => {
  const sut = new NullValidatorAdapter()
  const invalidTypes = ['', 1, true, false, {}, [], function () { }, (f: any) => f]
  const validTypes = [undefined, null]

  return {
    sut,
    invalidTypes,
    validTypes
  }
}

describe('NullValidator', () => {
  test('should return false if isn\'t empty', async () => {
    const { sut, invalidTypes } = makeSut()
    for (const value of invalidTypes) {
      await expect(sut.isNull(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if is an empty string, undefined or null', async () => {
    const { sut, validTypes } = makeSut()
    for (const value of validTypes) {
      await expect(sut.isNull(value)).resolves.toBeTruthy()
    }
  })
})
