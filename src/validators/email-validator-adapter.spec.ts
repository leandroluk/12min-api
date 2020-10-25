import { IEmailValidator } from '@/presentation/protocols/email-validator'
import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

const makeSut = (): {
  sut: IEmailValidator
  invalidTypes: any[]
  validTypes: any[]
} => {
  const sut = new EmailValidatorAdapter()
  const invalidTypes = [
    '', 1, true, {}, [], function () { }, (f: any) => f,
    'a', 'a@', 'a@a', 'a@a.c', 'a a@a.com', 'a@a.123'
  ]
  const validTypes = ['a@a.com', 'foo@bar.com', 'a@a.com.br']

  return {
    sut,
    invalidTypes,
    validTypes
  }
}

describe('EmailValidator', () => {
  test('should return false if invalid email is provided', async () => {
    const { sut, invalidTypes } = makeSut()
    for (const value of invalidTypes) {
      await expect(sut.isEmail(value)).resolves.toBeFalsy()
    }
  })

  test('should return true if a valid email is provided', async () => {
    const { sut, validTypes } = makeSut()
    for (const value of validTypes) {
      await expect(sut.isEmail(value)).resolves.toBeTruthy()
    }
  })

  test('should return false if validator throws', async () => {
    const { sut } = makeSut()
    const validatorSpy = jest.spyOn(validator, 'isEmail').mockImplementation(() => { throw new Error() })
    const result = await sut.isEmail('any@email.com')
    expect(validatorSpy).toBeCalled()
    expect(result).toBeFalsy()
  })
})
