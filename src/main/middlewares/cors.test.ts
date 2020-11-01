import request from 'supertest'
import app from '../config/app'

describe('cors', () => {
  test('should enable cors', async () => {
    const url = '/test-cors'

    app.get(url, (_, res) => res.send())

    await request(app)
      .get(url)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
