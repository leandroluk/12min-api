import { IUserModel } from '../../../domain/models/user.model'
import { IAddUser, IAddUserModel } from '../../../domain/use-cases/add-user'
import { IAddUserValidate } from '../../../domain/use-cases/add-user-validate'
import { EmailInUseError } from '../../../errors/email-in-use/email-in-use.error'
import { IController } from '../../protocols/controller'
import { INullValidator } from '../../protocols/null-validator'
import { AddUserController } from './add-user.controller'

const makeAddUser = (): IAddUser => {
  class AddUserRepositoryStub implements IAddUser {
    async addUser(user: IAddUserModel): Promise<IUserModel> {
      return await Promise.resolve({
        id: 'sample_id',
        createdAt: new Date(),
        email: user.email,
        password: user.password
      })
    }
  }
  return new AddUserRepositoryStub()
}

const makeAddUserValidator = (): IAddUserValidate => {
  class ValidateUserStub implements IAddUserValidate {
    async validateAddUser(user: IAddUserModel): Promise<any> {
      return await Promise.resolve({})
    }
  }
  return new ValidateUserStub()
}

const makeNullValidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new NullValidatorStub()
}

const makeSut = (): {
  addUserReposiory: IAddUser
  addUserValidator: IAddUserValidate
  nullValidator: INullValidator
  sut: IController
} => {
  const addUserReposiory = makeAddUser()
  const addUserValidator = makeAddUserValidator()
  const nullValidator = makeNullValidator()
  const sut = new AddUserController(addUserReposiory, nullValidator, addUserValidator)

  return {
    addUserReposiory,
    addUserValidator,
    nullValidator,
    sut
  }
}

describe('AddUserController', () => {
  describe('handle', () => {
    test('should return 400 with missing param error if no have any body with user', async () => {
      const { sut, nullValidator } = makeSut()

      jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)

      const httpResponse = await sut.handle({ header: {} })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body?.message).toMatch(/Missing param.*body/)
    })

    test('should IValidateUser.validateUser is called', async () => {
      const { sut, addUserValidator } = makeSut()
      const validateAddUserSpy = jest.spyOn(addUserValidator, 'validateAddUser')
      await sut.handle({ body: { email: 'any@email', password: '12312' } })
      expect(validateAddUserSpy).toBeCalled()
    })

    test('should return 400 if body is invalid', async () => {
      const { sut, addUserValidator } = makeSut()

      jest.spyOn(addUserValidator, 'validateAddUser').mockResolvedValue({
        email: { message: '123' }
      })

      const httpResponse = await sut.handle({ body: {} })
      expect(httpResponse.body.message).toMatch(/Object validation/)
    })

    test('should return 400 if email exists in db for another user', async () => {
      const { sut, addUserReposiory } = makeSut()
      jest.spyOn(addUserReposiory, 'addUser').mockRejectedValue(new EmailInUseError('a@a.com'))
      const httpRequest = { body: { email: 'any@email.com' } }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body.message).toMatch(/Email .* in use/)
    })
  })
})
