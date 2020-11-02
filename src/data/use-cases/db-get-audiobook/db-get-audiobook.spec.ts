import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IGetAudiobookRepository } from '../../protocols/get-audiobook.repository'
import { DbGetAudiobook } from './db-get-audiobook'

const makeGetAudiobookRepository = (): IGetAudiobookRepository => {
  class GetAudiobookRepositoryStub implements IGetAudiobookRepository {
    async getAudiobook(audiobookId: string): Promise<IAudiobookWithLastStatusModel> {
      return await Promise.resolve({
        id: audiobookId,
        createdAt: new Date(),
        status: AudiobookStatus.PENDING,
        title: 'title',
        description: 'description',
        tags: ['tags']
      })
    }
  }
  return new GetAudiobookRepositoryStub()
}

const makeSut = (): {
  getAudiobookRepository: IGetAudiobookRepository
  sut: DbGetAudiobook
} => {
  const getAudiobookRepository = makeGetAudiobookRepository()
  const sut = new DbGetAudiobook(getAudiobookRepository)

  return {
    getAudiobookRepository,
    sut
  }
}

describe('DbGetAudiobook', () => {
  describe('getAudiobook', () => {
    test('should call IGetAudiobookRepository with correct values', async () => {
      const { sut, getAudiobookRepository } = makeSut()
      const getAudiobookSpy = jest.spyOn(getAudiobookRepository, 'getAudiobook')
      await sut.getAudiobook('id')
      expect(getAudiobookSpy).toHaveBeenCalledWith('id')
    })

    test('should throw if IGetAudiobookStatusRepository throws', async () => {
      const { sut, getAudiobookRepository } = makeSut()
      jest.spyOn(getAudiobookRepository, 'getAudiobook').mockRejectedValue(new Error())
      await expect(sut.getAudiobook('id')).rejects.toThrow()
    })

    test('should return null if IGetAudiobookStatusRepository return null', async () => {
      const { sut, getAudiobookRepository } = makeSut()
      jest.spyOn(getAudiobookRepository, 'getAudiobook').mockResolvedValue(null)
      await expect(sut.getAudiobook('id')).resolves.toBeNull()
    })

    test('should return IAddAudiobookWithLastStatusModel if success', async () => {
      const { sut } = makeSut()
      const result = await sut.getAudiobook('id')
      expect(result.id).toBe('id')
      expect(result.createdAt.constructor.name).toBe('Date')
      expect(result.status).toBe('pending')
      expect(result.id).toBe('id')
    })

    test('should return IAddAudiobookWithLastStatusModel with status "pending" if IGetAudiobookRepository no return status', async () => {
      const { sut, getAudiobookRepository } = makeSut()
      jest.spyOn(getAudiobookRepository, 'getAudiobook').mockResolvedValue({
        id: 'id',
        createdAt: new Date(),
        title: 'title',
        description: 'description',
        tags: ['tags']
      } as any)

      const result = await sut.getAudiobook('id')
      expect(result.status).toBe(AudiobookStatus.PENDING)
    })

    test('should return status as PENDING if returned audiobook no have the field status', async () => {
      const { sut, getAudiobookRepository } = makeSut()
      jest.spyOn(getAudiobookRepository, 'getAudiobook').mockResolvedValue({} as any)
      const result = await sut.getAudiobook('asd')
      expect(result).toBeDefined()
      expect(result.status).toBe(AudiobookStatus.PENDING)
    })
  })
})
