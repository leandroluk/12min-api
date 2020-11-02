import { IUserModel } from '../../../domain/models/user.model'
import { IGetUserRepository } from '../../protocols/get-user.repository'
import { DbGetUser } from './db-get-user'

const makeGetUserRepository = (): IGetUserRepository => {
  class GetUserRepositoryStub implements IGetUserRepository {
    async getUser(userId: string): Promise<IUserModel> {
      return await Promise.resolve({
        id: userId,
        email: 'email',
        createdAt: new Date()
      })
    }
  }
  return new GetUserRepositoryStub()
}

const makeSut = (): {
  getUserRepository: IGetUserRepository
  sut: DbGetUser
} => {
  const getUserRepository = makeGetUserRepository()
  const sut = new DbGetUser(getUserRepository)

  return {
    getUserRepository,
    sut
  }
}

describe('DbGetUser', () => {
  describe('getUserByEmail', () => {
    test('should call GetUserRepository with correct values', async () => {
      const { sut, getUserRepository } = makeSut()
      const getUserSpy = jest.spyOn(getUserRepository, 'getUser')
      await sut.getUser('userId')
      expect(getUserSpy).toHaveBeenCalledWith('userId')
    })

    test('should throw if IGetUserRepository throws', async () => {
      const { sut, getUserRepository } = makeSut()
      jest.spyOn(getUserRepository, 'getUser').mockRejectedValue(new Error())
      await expect(sut.getUser('userId')).rejects.toThrow()
    })


    test('should return UserModel if user is found', async () => {
      const { sut } = makeSut()
      const result = await sut.getUser('userId')

      expect(result).toBeTruthy()
      expect(result.email).toBe('email')
      expect(result.createdAt.constructor.name).toBe('Date')
    })
  })
})
