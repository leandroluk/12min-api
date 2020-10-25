import app from '@/main/config/app'
import request from 'supertest'

describe('cors', () => {
  test('should enable cors', async () => {
    const url = '/test-cors'

    app.post(url, (_, res) => {
      res.send()
    })

    await request(app)
      .get(url)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
