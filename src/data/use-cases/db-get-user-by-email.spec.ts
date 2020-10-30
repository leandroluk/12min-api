import { IUserModel } from '../../domain/models/user.model'
import { IGetUserByEmailRepository } from '../protocols/get-user-by-email.repository'
import { DbGetUserByEmail } from './db-get-user-by-email'

const makeGetUserRepository = (): IGetUserByEmailRepository => {
  class GetUserRepository implements IGetUserByEmailRepository {
    async geUserByEmail(email: string): Promise<IUserModel> {
      return await Promise.resolve({
        id: 'id',
        email,
        createdAt: new Date(),
        password: 'password'
      })
    }
  }
  return new GetUserRepository()
}

const makeSut = (): {
  getUserRepository: IGetUserByEmailRepository
  sut: DbGetUserByEmail
} => {
  const getUserRepository = makeGetUserRepository()
  const sut = new DbGetUserByEmail(getUserRepository)

  return {
    getUserRepository,
    sut
  }
}

describe('DbGetUser', () => {
  describe('getUserByEmail', () => {
    test('should call GetUserRepository with correct values', async () => {
      const { sut, getUserRepository } = makeSut()
      const getUserSpy = jest.spyOn(getUserRepository, 'geUserByEmail')
      await sut.getUserByEmail('email')
      expect(getUserSpy).toHaveBeenCalledWith('email')
    })

    test('should throw if IGetUserRepository throws', () => {
      const { sut, getUserRepository } = makeSut()
      jest.spyOn(getUserRepository, 'geUserByEmail').mockRejectedValue(new Error())
      expect(sut.getUserByEmail('email')).rejects.toThrow()
    })


    test('should return UserModel if user is found', async () => {
      const { sut } = makeSut()
      const result = await sut.getUserByEmail('email')

      expect(result).toBeTruthy()
      expect(result.email).toBe('email')
      expect(result.password).toBeTruthy()
    })
  })
})
