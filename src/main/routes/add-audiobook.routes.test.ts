import faker from 'faker'
import jwt from 'jsonwebtoken'
import path from 'path'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'
import FsHelper from '../helpers/fs.helper'


describe('add-audiobook', () => {
  FsHelper.removeDir(path.join(env.app.basePath, env.app.tempDir))

  const url = env.routes.base + env.routes.addAudiobook
  const upload = path.join(env.app.basePath, 'misc/sample.mp3')
  const data = JSON.stringify({
    title: faker.random.words(2),
    description: faker.random.words(4),
    tags: faker.random.words(Math.floor(Math.random() * 5 + 1)).split(' ')
  })

  let accessToken: string

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)

    await Promise.all([
      MongoHelper.getCollection(env.mongo.collections.audiobooks).deleteMany({}),
      MongoHelper.getCollection(env.mongo.collections.users).deleteMany({})
    ])

    const userId = (
      await MongoHelper.getCollection(env.mongo.collections.users).insertOne({
        email: faker.internet.email(),
        password: faker.internet.password(5)
      })
    ).ops[0]._id.toString()

    accessToken = 'Bearer ' + jwt.sign({ userId }, env.authentication.secret)
  })

  afterAll(async () => await MongoHelper.disconnect())

  describe('unauthorized', () => {
    test('should return 401 if no have bearer token', async () => {
      await request(app)
        .post(url)
        .attach('upload', upload, 'sample.mp3')
        .field('data', data)
        .expect(401)
    })
  })

  describe('missing body', () => {
    test('should return 400 if no have body', async () => {
      const result = await request(app)
        .post(url)
        .set('Authorization', accessToken)
        .attach('upload', upload, 'sample.mp3')

      expect(result.status).toBe(400)
      expect(result.body.message).toMatch(/Missing param.*body.*?/)
    })
  })

  describe('missing field in audiobook', () => {
    test('should return 400 if any required param is missing', async () => {
      const result = await request(app)
        .post(url)
        .set('Authorization', accessToken)
        .attach('upload', upload, 'sample.mp3')
        .field('data', JSON.stringify({ key: 'value' }))

      expect(result.status).toBe(400)
      expect(result.body.message).toMatch(/Object validation.*?/)
      expect(result.body.errors.title.message).toMatch(/Missing param.*title.*?/)
      expect(result.body.errors.description.message).toMatch(/Missing param.*description.*?/)
      expect(result.body.errors.tags.message).toMatch(/Missing param.*tags.*?/)
    })
  })

  describe('invalid param in audiobook', () => {
    test('should return 400 if has any invalid field', async () => {
      const result = await request(app)
        .post(url)
        .set('Authorization', accessToken)
        .attach('upload', upload, 'sample.mp3')
        .field('data', JSON.stringify({ title: 1, description: 1, tags: 1 }))

      expect(result.status).toBe(400)
      expect(result.body.message).toMatch(/Object validation.*?/)
      expect(result.body.errors.title.message).toMatch(/Invalid param.*title.*?/)
      expect(result.body.errors.description.message).toMatch(/Invalid param.*description.*?/)
      expect(result.body.errors.tags.message).toMatch(/Invalid param.*tags.*?/)
    })
  })

  describe('success', () => {
    test('should return 200 without insert repeated tags', async () => {
      const dataWithRepeatedTags = JSON.stringify({
        ...JSON.parse(data),
        tags: ['tag', 'tag', 'tag']
      })

      const result = await request(app)
        .post(url)
        .set('Authorization', accessToken)
        .attach('upload', upload, 'sample.mp3')
        .field('data', dataWithRepeatedTags)

      expect(result.status).toBe(200)
      expect(result.body.tags.length).toBe(1)
    })
  })
})
