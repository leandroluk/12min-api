import faker from 'faker'
import { IAddUserModel } from '../../../domain/use-cases/add-user'
import { IAddUserValidate } from '../../../domain/use-cases/add-user-validate'
import { IEmailValidator } from '../../protocols/email-validator'
import { INullValidator } from '../../protocols/null-validator'
import { IPasswordValidator } from '../../protocols/password-validator'
import { AddUserValidator } from './add-user.validator'

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
  addUserModel: IAddUserModel
  nullValidator: INullValidator
  emailValidator: IEmailValidator
  passwordValidator: IPasswordValidator
  sut: IAddUserValidate
} => {
  const addUserModel = {
    email: faker.internet.email(),
    password: faker.internet.password()
  }
  const nullValidator = makeNullValidator()
  const emailValidator = makeEmailValidator()
  const passwordValidator = makePasswordValidator()
  const sut = new AddUserValidator(
    nullValidator,
    emailValidator,
    passwordValidator
  )

  return {
    addUserModel,
    nullValidator,
    emailValidator,
    passwordValidator,
    sut
  }
}

describe('AddUserValidator', () => {
  describe('validateUser', () => {
    test('should return a object with missing param error if some required field isn\t provided', async () => {
      const { sut, nullValidator, addUserModel } = makeSut()
      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
      const result = await sut.validateAddUser(addUserModel)
      expect(result.email.message).toMatch(/Missing param.*email.*?/)
      expect(result.password.message).toMatch(/Missing param.*password.*?/)
    })

    test('should return a object with invalid param error if some field is invalid', async () => {
      const { sut, emailValidator, passwordValidator, addUserModel } = makeSut()
      jest.spyOn(emailValidator, 'isEmail').mockResolvedValueOnce(false)
      jest.spyOn(passwordValidator, 'isPassword').mockResolvedValueOnce(false)

      const result = await sut.validateAddUser(addUserModel)
      expect(result.email.message).toMatch(/Invalid param.*email.*?/)
      expect(result.password.message).toMatch(/Invalid param.*password.*?/)
    })
  })
})
