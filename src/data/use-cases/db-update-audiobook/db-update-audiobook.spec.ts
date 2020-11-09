import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IUpdateAudiobookModel } from '../../../domain/use-cases/update-audiobook'
import { IUpdateAudiobookRepository } from '../../protocols/update-audiobook.repository'
import { DbUpdateAudiobook } from './db-update-audiobook'

const makeUpdateAudiobookRepository = (): IUpdateAudiobookRepository => {
  class UpdateAudiobookRepositoryStub implements IUpdateAudiobookRepository {
    async updateAudiobook(_audiobookId: string, _audiobookData: IUpdateAudiobookModel): Promise<IAudiobookWithLastStatusModel> {
      return await Promise.resolve({
        id: 'audiobookId',
        createdAt: new Date(),
        updatedAt: new Date(),
        title: 'title',
        description: 'description',
        tags: ['tags'],
        status: AudiobookStatus.PENDING
      })
    }
  }
  return new UpdateAudiobookRepositoryStub()
}

const makeSut = (): {
  updateAudiobookRepository: IUpdateAudiobookRepository
  sut: DbUpdateAudiobook
} => {
  const updateAudiobookRepository = makeUpdateAudiobookRepository()
  const sut = new DbUpdateAudiobook(updateAudiobookRepository)

  return {
    updateAudiobookRepository,
    sut
  }
}

describe('DbUpdateAudiobook', () => {
  describe('updateAudiobook', () => {
    test('should call IUpdateAudiobookRepository with correct values', async () => {
      const { sut, updateAudiobookRepository } = makeSut()
      const updateAudiobookSpy = jest.spyOn(updateAudiobookRepository, 'updateAudiobook')
      await sut.updateAudiobook('audiobookId', {})
      expect(updateAudiobookSpy).toHaveBeenCalledWith('audiobookId', {})
    })

    test('should throw if IUpdateAudiobookRepository throws', async () => {
      const { sut, updateAudiobookRepository } = makeSut()
      jest.spyOn(updateAudiobookRepository, 'updateAudiobook').mockRejectedValue(new Error())
      await expect(sut.updateAudiobook('audiobookId', {})).rejects.toThrow()
    })

    test('should return undefined if audiobook is not found', async () => {
      const { sut, updateAudiobookRepository } = makeSut()
      jest.spyOn(updateAudiobookRepository, 'updateAudiobook').mockResolvedValue(undefined)
      await expect(sut.updateAudiobook('audiobookId', {})).resolves.toBeUndefined()
    })

    test('should return updated Audiobook with status if success', async () => {
      const { sut } = makeSut()
      const result = await sut.updateAudiobook('audiobookId', {})

      expect(result.id).toBe('audiobookId')
      expect(result.status).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })
  })
})
