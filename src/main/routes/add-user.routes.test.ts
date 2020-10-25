import app from '@/main/config/app'
import faker from 'faker'
import request from 'supertest'

describe('add user routes', () => {
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
