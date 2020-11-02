import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'
import { MongoGetAudiobookStatusRepository } from './get-audiobook-status.repository'

describe('GetAudiobookStatusRepository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.audiobookStatuses).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return audiobook on success', async () => {
    await MongoHelper.getCollection(env.mongo.collections.audiobookStatuses).insertOne({
      createdAt: new Date(),
      status: 'pending',
      audiobookId: 'id',
      convertAudioFile: 'path/to/file.mp3'
    })

    const sut = new MongoGetAudiobookStatusRepository()
    const audiobook = await sut.getAudiobookStatus('id')

    expect(audiobook).toBeTruthy()
    expect(audiobook.id).toBeTruthy()
    expect(audiobook.createdAt.constructor.name).toBe('Date')
    expect(audiobook.status).toBe('pending')
    expect(audiobook.audiobookId).toBe('id')
    expect(audiobook.convertAudioFile).toBe('path/to/file.mp3')
  })

  test('should return null if not found', async () => {
    const sut = new MongoGetAudiobookStatusRepository()
    const user = await sut.getAudiobookStatus('id')
    expect(user).toBeNull()
  })
})
