import { ObjectID } from 'mongodb'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'
import { MongoRemoveAudiobookRepository } from './remove-audiobook.repository'


describe('RemoveAudiobookRepository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.audiobooks).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should throw invalid param error if audiobookId is not a valid ObjectID', async () => {
    const sut = new MongoRemoveAudiobookRepository()
    expect(sut.removeAudiobook('invalid')).rejects.toThrow()
  })

  test('should return true on audiobook is deleted', async () => {
    const audiobookId = ((
      await MongoHelper.getCollection(env.mongo.collections.audiobooks).insertOne({
        createdAt: new Date(),
        title: 'title',
        description: 'description',
        filePath: 'path/to/file.mp3',
        tags: ['tags']
      })
    ).ops[0]._id as ObjectID).toHexString()

    const sut = new MongoRemoveAudiobookRepository()
    await expect(sut.removeAudiobook(audiobookId)).resolves.toBeTruthy()
  })

  test('should return false if audiobookId is not found', async () => {
    const sut = new MongoRemoveAudiobookRepository()
    const audiobookId = MongoHelper.objectId().toHexString()
    await expect(sut.removeAudiobook(audiobookId)).resolves.toBeFalsy()
  })
})
