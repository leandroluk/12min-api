import bcrypt from 'bcrypt'
import { ObjectID } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo.helper'
import app from '../../config/app'
import env from '../../config/env'

describe('authenticate-user', () => {
  const url = env.routes.base + env.routes.authenticateUser
  const user = {
    email: 'test@email.com',
    password: bcrypt.hashSync('test', env.cryptography.salt),
    _password: 'test',
    createdAt: new Date()
  }

  let userId: string = null

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)

    const usersCollection = MongoHelper.getCollection(env.mongo.collections.users)

    await usersCollection.deleteMany({})

    userId = ((
      await usersCollection.insertOne(user)
    ).ops[0]._id as ObjectID).toHexString()
  })

  afterAll(async () => await MongoHelper.disconnect())

  describe('invalid body', () => {
    test('should return 400 if body is missing', async () => {
      const response = await request(app)
        .post(url)
        .send(undefined)

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/Missing param.*body.*?/)
    })
  })

  describe('missing fields', () => {
    test('should return 400 if some required field is missing', async () => {
      const response = await request(app)
        .post(url)
        .send({ key: 'value' })

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/Object validation.*/)
      expect(response.body.errors.email.message).toMatch(/Missing param.*email.*?/)
      expect(response.body.errors.password.message).toMatch(/Missing param.*password.*?/)
    })
  })

  describe('invalid fields', () => {
    test('should return 400 if some required field is missing', async () => {
      const response = await request(app)
        .post(url)
        .send({ email: 1, password: 1 })

      expect(response.status).toBe(400)
      expect(response.body.message).toMatch(/Object validation.*/)
      expect(response.body.errors.email.message).toMatch(/Invalid param.*email.*?/)
      expect(response.body.errors.password.message).toMatch(/Invalid param.*password.*?/)
    })
  })

  describe('success', () => {
    test('should return user on success ', async () => {
      const response = await request(app)
        .post(url)
        .send({
          email: user.email,
          password: user._password
        })

      expect(response.body.accessToken).toBeTruthy()
      expect(response.body.userId).toEqual(userId)
    })
  })
})
