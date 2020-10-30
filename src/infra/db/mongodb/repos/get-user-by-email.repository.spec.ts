import { MongoHelper } from '../helpers/mongo.helper'
import { MongoGetUserByEmailRepository } from './get-user-by-email.repository'


describe('GetUserRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => await MongoHelper.getCollection('users').deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return user on success', async () => {
    MongoHelper.getCollection('users').insertOne({
      email: 'email',
      password: 'password',
      createdAt: new Date()
    })

    const sut = new MongoGetUserByEmailRepository()
    const user = await sut.geUserByEmail('email')

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.createdAt.constructor.name).toBe('Date')
    expect(user.email).toBe('email')
    expect(user.password).toBe('password')
  })

  test('should return null if not found', async () => {
    const sut = new MongoGetUserByEmailRepository()
    const user = await sut.geUserByEmail('email')
    expect(user).toBeNull()
  })
})
