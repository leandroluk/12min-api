import { IAddAudiobookStatusRepository } from '../../../../../data/protocols/add-audiobook-status.repository'
import { AudiobookStatus } from '../../../../../domain/models/audiobook.model'
import { IAddAudiobookStatusModel } from '../../../../../domain/use-cases/add-audiobook-status'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'
import { MongoAddAudiobookStatusRepository } from './add-audiobook-status.repository'

const makeSut = (): {
  addAudiobookStatus: IAddAudiobookStatusModel
  sut: IAddAudiobookStatusRepository
} => {
  const addAudiobookStatus: IAddAudiobookStatusModel = {
    audiobookId: '5f9e20b430713d4d5d4d39bf',
    status: AudiobookStatus.PENDING,
    convertAudioFile: 'path/to/file.mp3'
  }
  const sut = new MongoAddAudiobookStatusRepository()

  return {
    addAudiobookStatus,
    sut
  }
}

describe('MongoAddAudiobookStatusRepository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.audiobookStatuses).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return addAudiobookStatus on success', async () => {
    const { sut, addAudiobookStatus } = makeSut()
    const audiobookStatus = await sut.addAudiobookStatus(addAudiobookStatus)

    expect(audiobookStatus.id).toBeTruthy()
    expect(audiobookStatus.createdAt.constructor.name).toBe('Date')
    expect(audiobookStatus.status).toBe(addAudiobookStatus.status)
    expect(audiobookStatus.audiobookId).toBe('5f9e20b430713d4d5d4d39bf')
    expect(audiobookStatus.convertAudioFile).toBe(addAudiobookStatus.convertAudioFile)
  })
})
