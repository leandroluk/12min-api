import { IAddAudiobookRepository } from '../../../../../data/protocols/add-audiobook.repository'
import { IAddAudiobookModel } from '../../../../../domain/use-cases/add-audiobook'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'
import { MongoAddAudiobookRepository } from './add-audiobook.repository'

const makeSut = (): {
  audiobookData: IAddAudiobookModel
  sut: IAddAudiobookRepository
} => {
  const audiobookData = {
    title: 'title',
    description: 'description',
    tags: ['TAGS']
  }
  const sut = new MongoAddAudiobookRepository()

  return {
    audiobookData,
    sut
  }
}

describe('AddAudiobookRepository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))
  beforeEach(async () => await MongoHelper.getCollection(env.mongo.collections.audiobooks).deleteMany({}))
  afterAll(async () => await MongoHelper.disconnect())

  test('should return audiobook on success with tags as lowercase', async () => {
    const { sut, audiobookData } = makeSut()
    const audiobook = await sut.addAudiobook(audiobookData)

    expect(audiobook).toBeTruthy()
    expect(audiobook.id).toBeTruthy()
    expect(audiobook.createdAt.constructor.name).toBe('Date')
    expect(audiobook.title).toBe(audiobookData.title)
    expect(audiobook.description).toBe(audiobookData.description)
    expect(audiobook.tags[0]).toBe('tags')
  })
})
