import { IUserModel } from '../../domain/models/user.model'
import { IAddUserModel } from '../../domain/use-cases/add-user'
import { IAddUserRepository } from '../protocols/add-user.repository'
import { IEncrypter } from '../protocols/encrypter'
import { IGetUserRepository } from '../protocols/get-user.repository'
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

const makeGetUserRepository = (): IGetUserRepository => {
  class GetUserRepositoryStub implements IGetUserRepository {
    async geUserByEmail(email: string): Promise<IUserModel> {
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

const makeAddUserModel = (): IAddUserModel => ({
  email: 'valid_email',
  password: 'valid_password'
})

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
  getUserRepository: IGetUserRepository
  encrypter: IEncrypter
  sut: DbAddUser
} => {
  const addUserRepository = makeAddUserRepository()
  const getUserRepository = makeGetUserRepository()
  const encrypter = makeEncrypter()
  const sut = new DbAddUser(addUserRepository, getUserRepository, encrypter)

  return {
    addUserRepository,
    getUserRepository,
    encrypter,
    sut
  }
}

describe('DbAddUser', () => {
  describe('addUser', () => {
    test('should call encrypter with correct password', async () => {
      const { sut, encrypter, getUserRepository } = makeSut()
      jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      const encrypterSpy = jest.spyOn(encrypter, 'encrypt')
      const user = makeAddUserModel()
      await sut.addUser(user)
      expect(encrypterSpy).toHaveBeenCalledWith(user.password)
    })

    test('should call AddUserRepository with correct values', async () => {
      const { sut, getUserRepository, addUserRepository } = makeSut()
      jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      const addUserSpy = jest.spyOn(addUserRepository, 'addUser')
      const user = makeAddUserModel()
      await sut.addUser(user)
      expect(addUserSpy).toHaveBeenCalledWith({ ...user, password: 'hashed' })
    })

    test('should call GetUserRepository with correct values', async () => {
      const { sut, getUserRepository } = makeSut()
      const getUserSpy = jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      const user = makeAddUserModel()
      await sut.addUser(user)
      expect(getUserSpy).toHaveBeenCalledWith(user.email)
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
      const { sut, getUserRepository } = makeSut()
      jest.spyOn(getUserRepository, 'geUserByEmail').mockResolvedValue(null)
      const user = makeAddUserModel()
      const result = await sut.addUser(user)
      expect(result.email).toBe(user.email)
      expect(result.password).toBe('hashed')
    })
  })
})
