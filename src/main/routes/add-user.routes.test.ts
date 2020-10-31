import faker from 'faker'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'


describe('add-user', () => {
  const url = env.route.base + env.route.addUser

  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.users).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return user on success ', async () => {
    await request(app)
      .post(url)
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(5)
      })
      .expect(200)
  })

  test('should return 400 if no have body', async () => {
    await request(app)
      .post(url)
      .expect(400)
      .expect(/Missing param.*body.*?/)
  })

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
