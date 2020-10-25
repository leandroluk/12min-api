import { IAddUserRepository } from '@/data/protocols/add-user.repository'
import { IEncrypter } from '@/data/protocols/encrypter'
import { IAddUserModel } from '@/domain/use-cases/add-user'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo.helper'
import { MongoAddUserRepository } from './add-user.repository'

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return await Promise.resolve('hashed')
    }
  }
  return new EncrypterStub()
}

const makeSut = (): {
  encrypter: IEncrypter
  userData: IAddUserModel
  sut: IAddUserRepository
} => {
  const encrypter = makeEncrypter()
  const userData = {
    email: 'any@email.com',
    password: 'any_password'
  }
  const sut = new MongoAddUserRepository(encrypter)

  return {
    encrypter,
    userData,
    sut
  }
}

describe('AddUserRepository', () => {
  test('should true', () => { })

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('should calls encrypter with email plus password', async () => {
    const { sut, encrypter, userData } = makeSut()
    const encryptSpy = jest.spyOn(encrypter, 'encrypt')
    await sut.addUser(userData)
    expect(encryptSpy).toHaveBeenCalledWith(userData.email + userData.password)
  })

  test('should return user on success', async () => {
    const { sut, userData } = makeSut()
    const user = await sut.addUser(userData)

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.createdAt.constructor.name).toBe('Date')
    expect(user.updatedAt).toBeFalsy()
    expect(user.email).toBe(userData.email)
    expect(user.password).toBe(userData.password)
    expect(user.secret).toBeTruthy()
  })
})
