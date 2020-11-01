import faker from 'faker'
import jwt from 'jsonwebtoken'
import { ObjectID } from 'mongodb'
import request from 'supertest'
import { AudiobookStatus } from '../../domain/models/audiobook.model'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'

describe('get-audiobook', () => {
  const url = env.routes.base + env.routes.getAudiobook

  let accessToken: string
  let audiobookId: string

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)

    const audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)
    const audiobookStatusCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)
    const userCollection = MongoHelper.getCollection(env.mongo.collections.users)

    await Promise.all([
      audiobookCollection.deleteMany({}),
      audiobookStatusCollection.deleteMany({}),
      userCollection.deleteMany({})
    ])

    audiobookId = ((
      await audiobookCollection.insertOne({
        createdAt: new Date(),
        title: 'title',
        description: 'description',
        filePath: 'path/to/file.mp3',
        tags: ['tags']
      })
    ).ops[0]._id as ObjectID).toHexString()

    await audiobookStatusCollection.insertOne({
      createdAt: new Date(),
      status: AudiobookStatus.PENDING,
      audiobookId,
      convertAudioFile: 'path/to/file.mp3'
    })

    const userId = (
      await userCollection.insertOne({
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
        .get(url.replace(':audiobookId', audiobookId))
        .expect(401)
    })
  })

  describe('not found', () => {
    test('should return 404 if audiobookId is invalid', async () => {
      const result = await request(app)
        .get(url)
        .set('Authorization', accessToken)

      expect(result.status).toBe(404)
      expect(result.body.message).toMatch(/No data found.*?/)
    })
  })

  describe('success', () => {
    test('should return 200 with audiobook if exists', async () => {
      const result = await request(app)
        .get(url.replace(':audiobookId', audiobookId))
        .set('Authorization', accessToken)

      expect(result.status).toBe(200)
      expect(result.body.id).toBeDefined()
      expect(result.body.createdAt).toBeDefined()
      expect(result.body.title).toBe('title')
      expect(result.body.description).toBe('description')
      expect(result.body.status).toBeDefined()
    })
  })
})
