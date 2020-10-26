import faker from 'faker'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'

describe('add-user', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection('users').deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should enable cors', async () => {
    await request(app)
      .post('/api/user')
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(5)
      })
      .expect(200)
  })
})
