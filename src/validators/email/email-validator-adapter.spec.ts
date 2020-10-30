import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  test('should return false if invalid email is provided', async () => {
    const sut = new EmailValidatorAdapter()
    const invalid = [
      '', 1, true, {}, [], function () { }, (f: any) => f,
      'a', 'a@', 'a@a', 'a@a.c', 'a a@a.com', 'a@a.123'
    ]

    for (const value of invalid) {
      await expect(sut.isEmail(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if a valid email is provided', async () => {
    const sut = new EmailValidatorAdapter()
    const valid = [
      'a@a.com', 'foo@bar.com', 'a@a.com.br'
    ]
    for (const value of valid) {
      await expect(sut.isEmail(value)).resolves.toBeTruthy()
    }
  })

  test('should return false if validator throws', async () => {
    const sut = new EmailValidatorAdapter()
    const validatorSpy = jest.spyOn(validator, 'isEmail').mockImplementation(() => { throw new Error() })
    const result = await sut.isEmail('any@email.com')
    expect(validatorSpy).toHaveBeenCalled()
    expect(result).toBeFalsy()
  })
})
