import faker from 'faker'
import jwt from 'jsonwebtoken'
import { Collection, ObjectID } from 'mongodb'
import path from 'path'
import request from 'supertest'
import { AudiobookStatus } from '../../../domain/models/audiobook.model'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo.helper'
import FsHelper from '../../../infra/helpers/fs.helper'
import app from '../../config/app'
import env from '../../config/env'

describe('update-audiobook', () => {
  FsHelper.removeDir(path.join(env.app.basePath, env.app.tempDir))

  const url = env.routes.base + env.routes.updateAudiobook
  const upload = path.join(env.app.basePath, 'misc/sample.mp3')
  const data = JSON.stringify({
    title: faker.random.words(2),
    description: faker.random.words(4),
    tags: faker.random.words(Math.floor(Math.random() * 5 + 1)).split(' ')
  })

  let accessToken: string
  let audiobookCollection: Collection
  let audiobookStatusesCollection: Collection
  let audiobookId: ObjectID

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)

    const userCollection = MongoHelper.getCollection(env.mongo.collections.users)
    audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)
    audiobookStatusesCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)

    await Promise.all([
      userCollection.deleteMany({}),
      audiobookCollection.deleteMany({}),
      audiobookStatusesCollection.deleteMany({})
    ])

    const userId = ((
      await userCollection.insertOne({
        email: faker.internet.email(),
        password: faker.internet.password(5)
      })
    ).ops[0]._id as ObjectID).toHexString()

    accessToken = 'Bearer ' + jwt.sign({ userId }, env.authentication.secret)

    audiobookId = (
      await audiobookCollection.insertOne({
        ...JSON.parse(data),
        createdAt: new Date()
      })
    ).ops[0]._id as ObjectID

    await audiobookStatusesCollection.insertOne({
      createdAt: new Date(),
      status: AudiobookStatus.READY,
      audiobookId
    })
  })

  afterAll(async () => await MongoHelper.disconnect())

  describe('unauthorized', () => {
    test('should return 401 if no have bearer token', async () => {
      await request(app)
        .put(url)
        .attach('upload', upload, 'sample.mp3')
        .field('data', data)
        .expect(401)
    })
  })

  describe('missing body', () => {
    test('should return 400 if no have body', async () => {
      const result = await request(app)
        .put(url)
        .set('Authorization', accessToken)
        .attach('upload', upload, 'sample.mp3')

      expect(result.status).toBe(400)
      expect(result.body.message).toMatch(/Missing param.*body.*?/)
    })
  })

  describe('invalid param in audiobook', () => {
    test('should return 400 if has any invalid field', async () => {
      const result = await request(app)
        .put(url)
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
    test('should return 200 without insert repeated tags and status pending', async () => {
      const dataWithRepeatedTags = JSON.stringify({
        ...JSON.parse(data),
        tags: ['tag', 'tag', 'tag']
      })

      const result = await request(app)
        .put(url.replace(':audiobookId', audiobookId.toHexString()))
        .set('Authorization', accessToken)
        .attach('upload', upload, 'sample.mp3')
        .field('data', dataWithRepeatedTags)

      expect(result.status).toBe(200)
      expect(result.body.tags.length).toBe(1)
      expect(result.body.status).toBe(AudiobookStatus.PENDING)
      expect(result.body.createdAt).toBeDefined()
      expect(result.body.updatedAt).toBeDefined()
    })
  })
})
