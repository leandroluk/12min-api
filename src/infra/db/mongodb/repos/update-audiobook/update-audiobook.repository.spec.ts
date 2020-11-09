import { Collection, ObjectID } from 'mongodb'
import { AudiobookStatus } from '../../../../../domain/models/audiobook.model'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'
import { MongoUpdateAudiobookRepository } from './update-audiobook.repository'

describe('MongoUpdateAudiobookRepository', () => {
  let audiobookCollection: Collection<any>
  let audiobookStatusCollection: Collection<any>
  let audiobookId: ObjectID

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)
    audiobookStatusCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)

    await Promise.all([
      audiobookCollection.deleteMany({}),
      audiobookStatusCollection.deleteMany({})
    ])

    audiobookId = (
      await audiobookCollection.insertOne({
        createdAt: new Date(),
        title: 'title',
        description: 'description',
        filePath: 'filePath',
        tags: ['tags']
      })
    ).ops[0]._id

    await audiobookStatusCollection.insertOne({
      createdAt: new Date(),
      status: AudiobookStatus.PENDING,
      audiobookId,
      convertAudioFile: '/path/to/file.mp3'
    })
  })

  afterAll(async () => await MongoHelper.disconnect())

  test('should return notthing if no have some field to change', async () => {
    const sut = new MongoUpdateAudiobookRepository()
    const invalidAudiobookId = MongoHelper.objectId().toHexString()
    const result = await sut.updateAudiobook(invalidAudiobookId, {})
    expect(result).toBeFalsy()
  })

  test('should return a updated audiobook with updatedAt field', async () => {
    const sut = new MongoUpdateAudiobookRepository()
    const result = await sut.updateAudiobook(audiobookId.toHexString(), { title: 'changed' })

    expect(result.updatedAt).toBeDefined()
    expect(result.status).toBeDefined()
    expect(result.title).toBe('changed')
  })

  test('should return notthing if no audiobook isn\'t found', async () => {
    const sut = new MongoUpdateAudiobookRepository()
    const invalidAudiobookId = MongoHelper.objectId().toHexString()
    const result = await sut.updateAudiobook(invalidAudiobookId, { title: 'changed' })

    expect(result).toBeFalsy()
  })
})
