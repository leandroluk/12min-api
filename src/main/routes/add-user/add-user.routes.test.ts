import faker from 'faker'
import request from 'supertest'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo.helper'
import app from '../../config/app'
import env from '../../config/env'


describe('add-user', () => {
  const url = env.routes.base + env.routes.addUser

  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.users).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  describe('ho have body', () => {
    test('should return 400 if no have body', async () => {
      await request(app)
        .post(url)
        .expect(400)
        .expect(/Missing param.*body.*?/)
    })
  })

  describe('missing param', () => {
    test('should return 400 if missing required param', async () => {
      await request(app)
        .post(url)
        .send({ password: 'password' })
        .expect(400)
        .expect(/Missing param.*email.*?/)
      await request(app)
        .post(url)
        .send({ email: 'sample@email.com' })
        .expect(400)
        .expect(/Missing param.*password.*?/)
    })
  })

  describe('invalid param', () => {
    test('should return 400 if invalid param', async () => {
      await request(app)
        .post(url)
        .send({ email: 'invalid_email', password: 'password' })
        .expect(400)
        .expect(/Invalid param/)
      await request(app)
        .post(url)
        .send({ email: 'sample@email.com', password: 'password_must_have_only_30_characters_but_this_has_much_more' })
        .expect(400)
        .expect(/Invalid param/)
    })
  })

  describe('email already exists', () => {
    test('should return 400 if email already exists', async () => {
      const existingUser = {
        email: 'already@exists.com',
        password: 'already_exists_com'
      }

      await MongoHelper.getCollection(env.mongo.collections.users).insertOne(existingUser)

      await request(app)
        .post(url)
        .send(existingUser)
        .expect(400)
    })
  })

  describe('success', () => {
    test('should return user on success ', async () => {
      await request(app)
        .post(url)
        .send({
          email: faker.internet.email(),
          password: faker.internet.password(5)
        })
        .expect(200)
    })
  })
})
