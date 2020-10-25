import { IPasswordValidator } from '@/presentation/protocols/password-validator'
import { PasswordValidatorAdapter } from './password-validator-adapter'

const makeSut = (): {
  sut: IPasswordValidator
  invalidTypes: any[]
  validTypes: any[]
} => {
  const sut = new PasswordValidatorAdapter()
  const invalidTypes = [
    '', 1, 1.1, true, {}, [], function () { }, (f: any) => f,
    '12', '0123456789012345678901234567891'
  ]
  const validTypes = ['123', '123123', '012345678901234560123456']

  return {
    sut,
    invalidTypes,
    validTypes
  }
}

describe('PasswordValidator', () => {
  test('should return true if invalid password is passed', async () => {
    const { sut, invalidTypes } = makeSut()
    for (const value of invalidTypes) {
      await expect(sut.isPassword(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if valid password is passed', async () => {
    const { sut, validTypes } = makeSut()
    for (const value of validTypes) {
      await expect(sut.isPassword(value)).resolves.toBeTruthy()
    }
  })
})
