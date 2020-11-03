import faker from 'faker'
import jwt from 'jsonwebtoken'
import { ObjectID } from 'mongodb'
import request from 'supertest'
import { AudiobookStatus } from '../../../domain/models/audiobook.model'
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo.helper'
import app from '../../config/app'
import env from '../../config/env'

describe('search-audiobook', () => {
  const url = env.routes.base + env.routes.searchAudiobooks

  let accessToken: string

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

    const audiobookId = ((
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
        .get(url)
        .expect(401)
    })
  })

  describe('empty result query', () => {
    test('should return 200 no audiobooks found', async () => {
      const result = await request(app)
        .get(url)
        .set('Authorization', accessToken)
        .query({ title: 'empty' })

      expect(result.status).toBe(200)
      expect(result.body.total).toBe(0)
    })
  })
  describe('success without query', () => {
    test('should return 200 with items if no pass query', async () => {
      const result = await request(app)
        .get(url)
        .set('Authorization', accessToken)

      expect(result.status).toBe(200)
      expect(result.body.total).toBe(1)
    })
  })

  describe('success with query', () => {
    test('should return 200 with items if no pass query', async () => {
      const result = await request(app)
        .get(url)
        .set('Authorization', accessToken)
        .query({ title: 'title' })

      expect(result.status).toBe(200)
      expect(result.body.total).toBe(1)
    })
  })
})
