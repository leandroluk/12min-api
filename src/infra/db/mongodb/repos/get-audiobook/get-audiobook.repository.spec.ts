import { ObjectID } from 'mongodb'
import { AudiobookStatus } from '../../../../../domain/models/audiobook.model'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'
import { MongoGetAudiobookRepository } from './get-audiobook.repository'

describe('GetAudiobookRepository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await Promise.all([
    MongoHelper.getCollection(env.mongo.collections.audiobooks).deleteMany({}),
    MongoHelper.getCollection(env.mongo.collections.audiobookStatuses).deleteMany({})
  ]))
  afterAll(async () => await MongoHelper.disconnect())


  test('should throw invalid param error if audiobookId isn\'t valid', async () => {
    const sut = new MongoGetAudiobookRepository()
    await expect(sut.getAudiobook('wrong')).rejects.toThrow(/Invalid param.*?/)
  })

  test('should return audiobook with last status on success', async () => {
    const audiobookId: ObjectID = (
      await MongoHelper.getCollection(env.mongo.collections.audiobooks).insertOne({
        createdAt: new Date(),
        title: 'title',
        description: 'description',
        filePath: 'filePath',
        tags: ['tags']
      })
    ).ops[0]._id

    await MongoHelper.getCollection(env.mongo.collections.audiobookStatuses).insertOne({
      createdAt: new Date(),
      status: AudiobookStatus.PENDING,
      audiobookId,
      convertAudioFile: '/path/to/file.mp3'
    })

    const sut = new MongoGetAudiobookRepository()
    const audiobook = await sut.getAudiobook(audiobookId.toHexString())

    expect(audiobook.id).toBeTruthy()
    expect(audiobook.createdAt.constructor.name).toBe('Date')
    expect(audiobook.title).toBe('title')
    expect(audiobook.description).toBe('description')
    expect(audiobook.filePath).toBe('filePath')
    expect(audiobook.tags[0]).toBe('tags')
    expect(audiobook.status).toBeTruthy()
  })

  test('should return null if not found', async () => {
    const sut = new MongoGetAudiobookRepository()
    const audiobook = await sut.getAudiobook(MongoHelper.objectId().toHexString())
    expect(audiobook).toBeNull()
  })
})
