import { AudiobookStatus, IAudiobookModel } from '../../domain/models/audiobook.model'
import { IAddAudiobookModel } from '../../domain/use-cases/add-audiobook'
import { IAddAudiobookRepository } from '../protocols/add-audiobook.repository'
import { DbAddAudiobook } from './db-add-audiobook'

const makeAddAudiobookRepository = (): IAddAudiobookRepository => {
  class AddAudiobookRepositoryStub implements IAddAudiobookRepository {
    async addAudiobook(audiobook: IAddAudiobookModel): Promise<IAudiobookModel> {
      return await Promise.resolve({
        id: 'id',
        createdAt: new Date(),
        title: audiobook.title,
        description: audiobook.description,
        tags: audiobook.tags,
        status: AudiobookStatus.PENDING
      })
    }
  }
  return new AddAudiobookRepositoryStub()
}

const makeSut = (): {
  addAudiobookRepository: IAddAudiobookRepository
  sut: DbAddAudiobook
  addAudiobookModel: IAddAudiobookModel
} => {
  const addAudiobookRepository = makeAddAudiobookRepository()
  const sut = new DbAddAudiobook(addAudiobookRepository)
  const addAudiobookModel = {
    title: 'title',
    description: 'description',
    tags: ['tags']
  }

  return {
    addAudiobookRepository,
    sut,
    addAudiobookModel
  }
}

describe('DbAddAudiobook', () => {
  describe('addAudiobook', () => {
    test('should call IAddAudiobookRepository', async () => {
      const { sut, addAudiobookRepository, addAudiobookModel } = makeSut()
      const addAudiobookSpy = jest.spyOn(addAudiobookRepository, 'addAudiobook')
      await sut.addAudiobook(addAudiobookModel)
      expect(addAudiobookSpy).toHaveBeenCalled()
    })

    test('should throw if IAddAudiobookRepository throws', async () => {
      const { sut, addAudiobookRepository } = makeSut()
      jest.spyOn(addAudiobookRepository, 'addAudiobook').mockRejectedValue(new Error())
      await expect(sut.addAudiobook({} as any)).rejects.toThrow()
    })

    test('should return AddAudiobookWithLastStatus if audiobook is created', async () => {
      const { sut, addAudiobookModel } = makeSut()
      const result = await sut.addAudiobook(addAudiobookModel)
      expect(result.id).toBe('id')
      expect(result.createdAt.constructor.name).toBe('Date')
      expect(result.title).toBe(addAudiobookModel.title)
      expect(result.description).toBe(addAudiobookModel.description)
      expect(result.tags[0]).toBe('tags')
      expect(result.status).toBe('pending')
    })

    test('should no add repeated tags wuen create audiobook', async () => {
      const { sut, addAudiobookModel } = makeSut()
      const repeatedTags = ['tag', 'tag', 'tag']

      const result = await sut.addAudiobook({
        ...addAudiobookModel,
        tags: repeatedTags
      })

      expect(result.tags.length).toBe(1)
    })
  })
})
