import { IUserModel } from '@/domain/models/user.model'
import { IAddUser, IAddUserModel } from '@/domain/use-cases/add-user'
import { IAddUserValidate, IAddUserValidateModel } from '@/domain/use-cases/add-user-validate'
import { EmailInUseError } from '@/errors/email-in-use.error'
import { IController } from '@/presentation/protocols/controller'
import faker from 'faker'
import { AddUserController } from './add-user.controller'

const makeAddUser = (): IAddUser => {
  class AddUserRepositoryStub implements IAddUser {
    async addUser(user: IAddUserModel): Promise<IUserModel> {
      return await Promise.resolve({
        id: faker.random.uuid(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })
    }
  }
  return new AddUserRepositoryStub()
}

const makeAddUserValidator = (): IAddUserValidate => {
  class ValidateUserStub implements IAddUserValidate {
    async validateAddUser(user: IAddUserValidateModel): Promise<any> {
      return await Promise.resolve({})
    }
  }
  return new ValidateUserStub()
}

const makeSut = (): {
  addUserReposiory: IAddUser
  addUserValidator: IAddUserValidate
  sut: IController
} => {
  const addUserReposiory = makeAddUser()
  const addUserValidator = makeAddUserValidator()
  const sut = new AddUserController(addUserReposiory, addUserValidator)

  return {
    addUserReposiory,
    addUserValidator,
    sut
  }
}

describe('AddUserController', () => {
  describe('handle', () => {
    test('should return 400 with missing param error if no have any body with user', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle({ header: {} })
      expect(httpResponse.statusCode).toBe(400)
      expect(httpResponse.body?.message).toMatch(/Missing param.*body/)
    })

    test('should IValidateUser.validateUser is called', async () => {
      const { sut, addUserValidator } = makeSut()
      const validateAddUserSpy = jest.spyOn(addUserValidator, 'validateAddUser')
      await sut.handle({ body: {} })
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