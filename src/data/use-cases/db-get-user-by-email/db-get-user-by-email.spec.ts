import { IUserWithPasswordModel } from '../../../domain/models/user.model'
import { IGetUserByEmailRepository } from '../../protocols/get-user-by-email.repository'
import { DbGetUserByEmail } from './db-get-user-by-email'

const makeGetUserByEmailRepository = (): IGetUserByEmailRepository => {
  class GetUserByEmailRepositoryStub implements IGetUserByEmailRepository {
    async getUserByEmail(email: string): Promise<IUserWithPasswordModel> {
      return await Promise.resolve({
        id: 'id',
        email,
        createdAt: new Date(),
        password: 'password'
      })
    }
  }
  return new GetUserByEmailRepositoryStub()
}

const makeSut = (): {
  getUserByEmailRepository: IGetUserByEmailRepository
  sut: DbGetUserByEmail
} => {
  const getUserByEmailRepository = makeGetUserByEmailRepository()
  const sut = new DbGetUserByEmail(getUserByEmailRepository)

  return {
    getUserByEmailRepository,
    sut
  }
}

describe('DbGetUserByEmail', () => {
  describe('getUserByEmail', () => {
    test('should call GetUserByEmailRepository with correct values', async () => {
      const { sut, getUserByEmailRepository } = makeSut()
      const getUserByEmailSpy = jest.spyOn(getUserByEmailRepository, 'getUserByEmail')
      await sut.getUserByEmail('email')
      expect(getUserByEmailSpy).toHaveBeenCalledWith('email')
    })

    test('should throw if IGetUserByEmailRepository throws', async () => {
      const { sut, getUserByEmailRepository } = makeSut()
      jest.spyOn(getUserByEmailRepository, 'getUserByEmail').mockRejectedValue(new Error())
      await expect(sut.getUserByEmail('email')).rejects.toThrow()
    })


    test('should return UserWithPasswordModel if user is found', async () => {
      const { sut } = makeSut()
      const result = await sut.getUserByEmail('email')

      expect(result).toBeTruthy()
      expect(result.email).toBe('email')
      expect(result.password).toBeTruthy()
    })
  })
})
