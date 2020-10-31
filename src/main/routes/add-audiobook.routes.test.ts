// import faker from 'faker'
// import fs from 'fs'
import path from 'path'
// import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo.helper'
// import app from '../config/app'
import env from '../config/env'
import FsHelper from '../helpers/fs.helper'

/*
const upload = fs.createReadStream(path.join(env.app.basePath, 'misc/sample.mp3'))

const data = JSON.stringify({
  title: faker.random.words(2),
  description: faker.random.words(4),
  tags: faker.random.words(Math.floor(Math.random() * 5 + 1))
})
*/
describe('add-audiobook', () => {
  // const url = env.route.base + env.route.addAudiobook

  beforeAll(async () => {
    FsHelper.removeDir(path.join(env.app.basePath, env.app.tempDir))
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    await MongoHelper.getCollection(env.mongo.collections.audiobooks).deleteMany({})
  })

  afterAll(async () => await MongoHelper.disconnect())

  test('should true', () => { })

  /*
  test('should return 401 if no have bearer token', async () => {
    await request(app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Content-Type', 'multipart/form-data')
      .attach('upload', upload)
      .field('data', data)
      .expect(401)
  })
  test('should return 400 if no have body', async () => {
    await request(app)
      .post(url)
      .expect(400)
      .expect(/Missing param.*body.*?/)
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
