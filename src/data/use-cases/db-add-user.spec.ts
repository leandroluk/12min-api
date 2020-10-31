import { IUserModel, IUserWithPasswordModel } from '../../domain/models/user.model'
import { IAddUserModel } from '../../domain/use-cases/add-user'
import { IAddUserRepository } from '../protocols/add-user.repository'
import { IEncrypter } from '../protocols/encrypter'
import { IGetUserByEmailRepository } from '../protocols/get-user-by-email.repository'
import { DbAddUser } from './db-add-user'

const makeAddUserRepository = (): IAddUserRepository => {
  class AddUserRepository implements IAddUserRepository {
    async addUser(user: IAddUserModel): Promise<IUserModel> {
      return await Promise.resolve({
        id: 'sample_id',
        createdAt: new Date(),
        email: user.email,
        password: user.password
      })
    }
  }
  return new AddUserRepository()
}

const makeGetUserRepository = (): IGetUserByEmailRepository => {
  class GetUserRepositoryStub implements IGetUserByEmailRepository {
    async geUserByEmail(email: string): Promise<IUserWithPasswordModel> {
      return await Promise.resolve({
        id: 'id',
        email,
        createdAt: new Date(),
        password: 'password'
      })
    }
  }
  return new GetUserRepositoryStub()
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async compare(_value: string, _hashed: string): Promise<boolean> {
      return await Promise.resolve(true)
    }

    async encrypt(_value: string): Promise<string> {
      return await Promise.resolve('hashed')
    }
  }
  return new EncrypterStub()
}

const makeSut = (): {
  addUserRepository: IAddUserRepository
  getUserRepository: IGetUserByEmailRepository
  encrypter: IEncrypter
  sut: DbAddUser
  userModel: IAddUserModel
} => {
  const addUserRepository = makeAddUserRepository()
  const getUserRepository = makeGetUserRepository()
  const encrypter = makeEncrypter()
  const sut = new DbAddUser(addUserRepository, getUserRepository, encrypter)
  const userModel = {
    email: 'valid_email',
    password: 'valid_password'
  }

  return {
    addUserRepository,
    getUserRepository,
    encrypter,
    sut,
    userModel
  }
}

describe('DbAddUser', () => {
  describe('addUser', () => {
    test('should call encrypter with correct password', async () => {
      const { sut, encrypter, getUserRepository, userModel } = makeSut()
      jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      const encrypterSpy = jest.spyOn(encrypter, 'encrypt')
      await sut.addUser(userModel)
      expect(encrypterSpy).toHaveBeenCalledWith(userModel.password)
    })

    test('should call AddUserRepository with correct values', async () => {
      const { sut, getUserRepository, addUserRepository, userModel } = makeSut()
      jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      const addUserSpy = jest.spyOn(addUserRepository, 'addUser')
      await sut.addUser(userModel)
      expect(addUserSpy).toHaveBeenCalledWith({ ...userModel, password: 'hashed' })
    })

    test('should call GetUserRepository with correct values', async () => {
      const { sut, getUserRepository, userModel } = makeSut()
      const getUserSpy = jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      await sut.addUser(userModel)
      expect(getUserSpy).toHaveBeenCalledWith(userModel.email)
    })

    test('should throw if IEncrypter throws', () => {
      const { sut, encrypter, getUserRepository } = makeSut()
      jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      jest.spyOn(encrypter, 'encrypt').mockRejectedValue(new Error())
      expect(sut.addUser({} as any)).rejects.toThrow()
    })

    test('should throw if IAddUserRepository throws', () => {
      const { sut, addUserRepository } = makeSut()
      jest.spyOn(addUserRepository, 'addUser').mockRejectedValue(new Error())
      expect(sut.addUser({} as any)).rejects.toThrow()
    })

    test('should return UserModel if user is created', async () => {
      const { sut, getUserRepository, userModel } = makeSut()
      jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      const result = await sut.addUser(userModel)
      expect(result.email).toBe(userModel.email)
    })
  })
})
