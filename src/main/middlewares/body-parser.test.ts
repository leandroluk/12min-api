import app from '@/main/config/app'
import request from 'supertest'

describe('bodyParser', () => {
  test('should should parse body as json', async () => {
    const data = { name: 'test' }
    app.post('/test', (req, res) => res.send(req.body))
    await request(app).post('/test').send(data).expect(data)
  })
})
