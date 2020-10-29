import faker from 'faker'
import { IAddUserModel } from '../../../domain/use-cases/add-user'
import { IAddUserValidate } from '../../../domain/use-cases/add-user-validate'
import { IEmailValidator } from '../../protocols/email-validator'
import { INullValidator } from '../../protocols/null-validator'
import { IPasswordValidator } from '../../protocols/password-validator'
import { AddUserValidator } from './add-user.validator'

const makeAddUserValidateModel = (): IAddUserModel => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

const makeNullValidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new NullValidatorStub()
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    async isEmail(_value: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new EmailValidatorStub()
}

const makePasswordValidator = (): IPasswordValidator => {
  class PasswordValidatorStub implements IPasswordValidator {
    async isPassword(_value: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new PasswordValidatorStub()
}

const makeSut = (): {
  nullValidator: INullValidator
  emailValidator: IEmailValidator
  passwordValidator: IPasswordValidator
  sut: IAddUserValidate
} => {
  const nullValidator = makeNullValidator()
  const emailValidator = makeEmailValidator()
  const passwordValidator = makePasswordValidator()
  const sut = new AddUserValidator(
    nullValidator,
    emailValidator,
    passwordValidator
  )

  return {
    nullValidator,
    emailValidator,
    passwordValidator,
    sut
  }
}

describe('AddUserValidator', () => {
  describe('validateUser', () => {
    test('should return a missing param error if some required field isn\t provided', async () => {
      const { sut, nullValidator } = makeSut()
      const user = makeAddUserValidateModel()
      const requiredFields = ['email', 'password']

      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)

      for (const field of requiredFields) {
        const current = { ...user }
        delete current[field]
        const result = await sut.validateAddUser(current)

        expect(result[field].message).toMatch(/Missing param/)
      }
    })

    test('should return a invalid param error inner object validation error if some field is invalid', async () => {
      const { sut, emailValidator, passwordValidator } = makeSut()
      const user = makeAddUserValidateModel()
      let result: any

      jest.spyOn(emailValidator, 'isEmail').mockResolvedValueOnce(false)
      result = await sut.validateAddUser(user)
      expect(result.email.message).toMatch(/Invalid param/)

      jest.spyOn(passwordValidator, 'isPassword').mockResolvedValueOnce(false)
      result = await sut.validateAddUser(user)
      expect(result.password.message).toMatch(/Invalid param/)
    })
  })
})