import app from '@/main/config/app'
import request from 'supertest'

describe('cors', () => {
  test('should enable cors', async () => {
    app.post('/test', (_, res) => res.send())

    await request(app)
      .get('/test')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
