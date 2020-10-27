import { MongoHelper } from '../helpers/mongo.helper'
import { MongoGetUserRepository } from './get-user.repository'


describe('GetUserRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    const usersCollection = MongoHelper.getCollection('users')
    await usersCollection.deleteMany({})
    await usersCollection.insertOne({
      email: 'email',
      password: 'password',
      createdAt: new Date()
    })
  })
  afterAll(async () => await MongoHelper.disconnect())

  test('should return user on success', async () => {
    const sut = new MongoGetUserRepository()
    const user = await sut.geUserByEmail('email')

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.createdAt.constructor.name).toBe('Date')
    expect(user.email).toBe('email')
    expect(user.password).toBe('password')
  })
})
