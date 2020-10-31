import faker from 'faker'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import path from 'path'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
import app from '../config/app'
import env from '../config/env'
import FsHelper from '../helpers/fs.helper'

FsHelper.removeDir(path.join(env.app.basePath, env.app.tempDir))

describe('add-audiobook', () => {
  const url = env.route.base + env.route.addAudiobook
  const data = JSON.stringify({
    title: faker.random.words(2),
    description: faker.random.words(4),
    tags: faker.random.words(Math.floor(Math.random() * 5 + 1)).split(' ')
  })
  const upload = fs.createReadStream(path.join(env.app.basePath, 'misc/sample.mp3'))

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
    console.log(accessToken)
  })

  afterAll(async () => await MongoHelper.disconnect())

  test('should return 401 if no have bearer token', done => {
    request(app)
      .post(url)
      .attach('upload', upload, 'sample.mp3')
      .field('data', data)
      .end((err, res) => {
        expect(res.status).toBe(401)
        done(err)
      })
  })

  /*
  test('should return 400 if no have body', done => {
    request(app)
      .post(url)
      .set('Authorization', accessToken)
      .attach('upload', upload, 'sample.mp3')
      .end((err, res) => {
        expect(res.status).toBe(400)
        expect(res.body).toMatch(/Missing param.*body.*?/)
        done(err)
      })
  })

  test('should return 400 if missing required param', async () => {
    await Promise.all([
      request(app)
        .post(url)
        .send({ password: 'password' })
        .expect(400)
        .expect(/Missing param.*email.*?/),
      request(app)
        .post(url)
        .send({ email: 'sample@email.com' })
        .expect(400)
        .expect(/Missing param.*password.*?/)
    ])
  })

  test('should return 400 if invalid param', async () => {
    await Promise.all([
      request(app)
        .post(url)
        .send({ email: 'invalid_email', password: 'password' })
        .expect(400)
        .expect(/Invalid param/),
      request(app)
        .post(url)
        .send({ email: 'sample@email.com', password: 'password_must_have_only_30_characters_but_this_has_much_more' })
        .expect(400)
        .expect(/Invalid param/)
    ])
  })

  test('should return 400 if email already exists', async () => {
    const existingUser = {
      email: 'already@exists.com',
      password: 'already_exists_com'
    }

    await MongoHelper.getCollection(env.mongo.collections.users).insertOne(existingUser)

    await request(app)
      .post(url)
      .send(existingUser)
      .expect(400)
  })
  */
})
