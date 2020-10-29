import bcrypt from 'bcrypt'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'

describe('authenticate-user', () => {
  const user = {
    email: 'test@email.com',
    password: bcrypt.hashSync('test', env.cryptography.salt),
    createdAt: new Date()
  }

  let userId: string = null

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    const usersCollection = MongoHelper.getCollection('users')
    await usersCollection.deleteMany({})
    const inserted = await usersCollection.insertOne(user)
    userId = inserted.ops[0]._id.toString()
  })

  afterAll(async () => await MongoHelper.disconnect())

  test('should return user on success ', async () => {
    const response = await request(app)
      .post(env.route.base + env.route.authenticateUser)
      .send({
        email: user.email,
        password: 'test'
      })

    expect(response.body.accessToken).toBeTruthy()
    expect(response.body.userId).toEqual(userId)
  })
})
