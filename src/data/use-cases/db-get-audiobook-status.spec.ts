import { IAudiobookStatusModel } from '../../domain/models/audiobook-status.model'
import { AudiobookStatus } from '../../domain/models/audiobook.model'
import { IGetAudiobookStatusRepository } from '../protocols/get-audiobook-status.repository'
import { DbGetAudiobookStatus } from './db-get-audiobook-status'

const makeGetAudiobookStatusRepository = (): IGetAudiobookStatusRepository => {
  class GetAudiobookStatusRepositoryStub implements IGetAudiobookStatusRepository {
    async getAudiobookStatus(audiobookId: string): Promise<IAudiobookStatusModel> {
      return await Promise.resolve({
        id: 'id',
        createdAt: new Date(),
        status: AudiobookStatus.PENDING,
        audiobookId: audiobookId,
        convertAudioFile: 'path/to/file.mp3'
      })
    }
  }
  return new GetAudiobookStatusRepositoryStub()
}

const makeSut = (): {
  getAudiobookStatusRepository: IGetAudiobookStatusRepository
  sut: DbGetAudiobookStatus
} => {
  const getAudiobookStatusRepository = makeGetAudiobookStatusRepository()
  const sut = new DbGetAudiobookStatus(getAudiobookStatusRepository)

  return {
    getAudiobookStatusRepository,
    sut
  }
}

describe('DbGetAudiobookStatus', () => {
  describe('getAudiobookStatus', () => {
    test('should call IGetAudiobookStatusRepository with correct values', async () => {
      const { sut, getAudiobookStatusRepository } = makeSut()
      const getAudiobookStatusSpy = jest.spyOn(getAudiobookStatusRepository, 'getAudiobookStatus')
      await sut.getAudiobookStatus('id')
      expect(getAudiobookStatusSpy).toHaveBeenCalledWith('id')
    })

    test('should throw if IGetAudiobookStatusRepository throws', async () => {
      const { sut, getAudiobookStatusRepository } = makeSut()
      jest.spyOn(getAudiobookStatusRepository, 'getAudiobookStatus').mockRejectedValue(new Error())
      await expect(sut.getAudiobookStatus('id')).rejects.toThrow()
    })

    test('should return null if IGetAudiobookStatusRepository return null', async () => {
      const { sut, getAudiobookStatusRepository } = makeSut()
      jest.spyOn(getAudiobookStatusRepository, 'getAudiobookStatus').mockResolvedValue(null)
      await expect(sut.getAudiobookStatus('id')).resolves.toBeNull()
    })

    test('should return IAudiobookStatusModel if success', async () => {
      const { sut } = makeSut()
      const result = await sut.getAudiobookStatus('id')
      expect(result.id).toBe('id')
      expect(result.createdAt.constructor.name).toBe('Date')
      expect(result.status).toBe('pending')
      expect(result.id).toBe('id')
      expect(result.convertAudioFile).toBe('path/to/file.mp3')
    })
  })
})
