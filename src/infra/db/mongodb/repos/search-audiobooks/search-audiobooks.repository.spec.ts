import { Collection, ObjectID } from 'mongodb'
import { AudiobookStatus } from '../../../../../domain/models/audiobook.model'
import env from '../../../../../main/config/env'
import { MongoHelper } from '../../helpers/mongo.helper'
import { MongoSearchAudiobooksRepository } from './search-audiobooks.repository'

describe('MongoSearchAudiobooksRepository', () => {
  const query = {
    description: '',
    limit: 50,
    offset: 0,
    tags: [],
    title: ''
  }
  let audiobookCollection: Collection<any>
  let audiobookStatusCollection: Collection<any>

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    audiobookCollection = MongoHelper.getCollection(env.mongo.collections.audiobooks)
    audiobookStatusCollection = MongoHelper.getCollection(env.mongo.collections.audiobookStatuses)

    await Promise.all([
      audiobookCollection.deleteMany({}),
      audiobookStatusCollection.deleteMany({})
    ])

    const audiobookId: ObjectID = (
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

  test('should return a list of audiobooks with last status inner a result query on success', async () => {
    const sut = new MongoSearchAudiobooksRepository()
    const result = await sut.searchAudiobooks(query)

    expect(result.limit).toBe(50)
    expect(result.offset).toBe(0)
    expect(result.total).toBeDefined()
    expect(result.items.length).toBe(1)
    expect(result.items[0].status).toBeDefined()
  })

  test('should return a list of audiobooks with last status inner a result query if tags is passed on success', async () => {
    const sut = new MongoSearchAudiobooksRepository()
    const result = await sut.searchAudiobooks({ ...query, tags: ['tags'] })

    expect(result.limit).toBe(50)
    expect(result.offset).toBe(0)
    expect(result.total).toBeDefined()
    expect(result.items.length).toBe(1)
    expect(result.items[0].status).toBeDefined()
  })

  test('should return result query without items', async () => {
    await Promise.all([
      audiobookCollection.deleteMany({}),
      audiobookStatusCollection.deleteMany({})
    ])

    const sut = new MongoSearchAudiobooksRepository()
    const result = await sut.searchAudiobooks(query)

    expect(result.limit).toBe(50)
    expect(result.offset).toBe(0)
    expect(result.total).toBeDefined()
    expect(result.items.length).toBe(0)
  })
})
