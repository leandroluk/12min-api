import { PasswordValidatorAdapter } from './password-validator-adapter'

describe('PasswordValidator', () => {
  test('should return true if invalid password is passed', async () => {
    const sut = new PasswordValidatorAdapter()
    const invalid = [
      '', 1, 1.1, true, {}, [], function () { }, (f: any) => f,
      '12', '0123456789012345678901234567891'
    ]
    for (const value of invalid) {
      await expect(sut.isPassword(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if valid password is passed', async () => {
    const sut = new PasswordValidatorAdapter()
    const valid = ['123', '123123', '012345678901234560123456']
    for (const value of valid) {
      await expect(sut.isPassword(value)).resolves.toBeTruthy()
    }
  })
})
