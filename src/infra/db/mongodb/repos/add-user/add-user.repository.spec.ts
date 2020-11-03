import { IAddUserRepository } from '../../../../../data/protocols/add-user.repository'
import { IAddUserModel } from '../../../../../domain/use-cases/add-user'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'
import { MongoAddUserRepository } from './add-user.repository'

const makeSut = (): {
  userData: IAddUserModel
  sut: IAddUserRepository
} => {
  const userData = {
    email: 'any@email.com',
    password: 'any_password'
  }
  const sut = new MongoAddUserRepository()

  return {
    userData,
    sut
  }
}

describe('AddUserRepository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.users).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return user without password on success', async () => {
    const { sut, userData } = makeSut()
    const user = await sut.addUser(userData)

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.createdAt.constructor.name).toBe('Date')
    expect(user.email).toBe(userData.email)
  })
})
