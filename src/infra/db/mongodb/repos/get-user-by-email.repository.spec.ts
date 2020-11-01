import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'
import { MongoGetUserByEmailRepository } from './get-user-by-email.repository'


describe('GetUserByEmailRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.users).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return user on success', async () => {
    await MongoHelper.getCollection(env.mongo.collections.users).insertOne({
      email: 'email',
      password: 'password',
      createdAt: new Date()
    })

    const sut = new MongoGetUserByEmailRepository()
    const user = await sut.getUserByEmail('email')

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.createdAt.constructor.name).toBe('Date')
    expect(user.email).toBe('email')
    expect(user.password).toBe('password')
  })

  test('should return null if not found', async () => {
    const sut = new MongoGetUserByEmailRepository()
    const user = await sut.getUserByEmail('email')
    expect(user).toBeNull()
  })
})
