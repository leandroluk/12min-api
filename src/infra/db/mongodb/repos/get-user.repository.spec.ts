import env from '../../../../main/config/env'
import { MongoHelper } from '../helpers/mongo.helper'
import { MongoGetUserRepository } from './get-user.repository'


describe('GetUserRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.users).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return user on success without password', async () => {
    const userId = (
      await MongoHelper.getCollection(env.mongo.collections.users).insertOne({
        email: 'email',
        password: 'password',
        createdAt: new Date()
      })
    ).ops[0]._id.toString()

    const sut = new MongoGetUserRepository()
    const user = await sut.getUser(userId) as any

    expect(user).toBeTruthy()
    expect(user.id).toBeTruthy()
    expect(user.createdAt.constructor.name).toBe('Date')
    expect(user.email).toBe('email')
    expect(user.password).toBeFalsy()
  })

  test('should return null if not found', async () => {
    const sut = new MongoGetUserRepository()
    const user = await sut.getUser(new MongoHelper.ObjectID().toHexString())
    expect(user).toBeNull()
  })
})
