import faker from 'faker'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'

describe('add-user', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection('users').deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return user on success ', async () => {
    await request(app)
      .post(env.route.base + env.route.addUser)
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(5)
      })
      .expect(200)
  })
})
