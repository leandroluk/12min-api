import { IUserModel } from '@/domain/models/user.model'
import { IAddUserModel } from '@/domain/use-cases/add-user'
import { IAddUserRepository } from '../protocols/add-user.repository'
import { IEncrypter } from '../protocols/encrypter'
import { DbAddUser } from './db-add-user'

const makeAddUserRepository = (): IAddUserRepository => {
  class AddUserRepository implements IAddUserRepository {
    async addUser(user: IAddUserModel): Promise<IUserModel> {
      return await Promise.resolve({
        id: 'sample_id',
        createdAt: new Date(),
        email: user.email,
        password: user.password,
        secret: 'secret'
      })
    }
  }
  return new AddUserRepository()
}

const makeAddUserModel = (): IAddUserModel => ({
  email: 'valid_email',
  password: 'valid_password'
})

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve(value + '_hashed')
    }
  }
  return new EncrypterStub()
}

const makeSut = (): {
  addUserRepository: IAddUserRepository
  encrypter: IEncrypter
  sut: DbAddUser
} => {
  const addUserRepository = makeAddUserRepository()
  const encrypter = makeEncrypter()
  const sut = new DbAddUser(addUserRepository, encrypter)

  return {
    addUserRepository,
    encrypter,
    sut
  }
}

describe('DbAddUser', () => {
  describe('addUser', () => {
    test('should call encrypter with correct password', async () => {
      const { sut, encrypter } = makeSut()
      const encrypterSpy = jest.spyOn(encrypter, 'encrypt')
      const user = makeAddUserModel()
      await sut.addUser(user)
      expect(encrypterSpy).toHaveBeenCalledWith(user.password)
    })

    test('should call AddUserRepository with correct values', async () => {
      const { sut, addUserRepository } = makeSut()
      const addUserSpy = jest.spyOn(addUserRepository, 'addUser')
      const user = makeAddUserModel()
      await sut.addUser(user)
      expect(addUserSpy).toHaveBeenCalledWith({
        ...user,
        password: user.password + '_hashed'
      })
    })

    test('should throw if IAddUserRepository throws', () => {
      const { sut, addUserRepository } = makeSut()
      jest.spyOn(addUserRepository, 'addUser').mockRejectedValue(new Error())
      expect(sut.addUser({} as any)).rejects.toThrow()
    })

    test('should return UserModel if user is created', async () => {
      const { sut } = makeSut()
      const user = makeAddUserModel()
      const result = await sut.addUser(user)
      expect(result.email).toBe(user.email)
      expect(result.password).toBe(user.password + '_hashed')
    })
  })
})
