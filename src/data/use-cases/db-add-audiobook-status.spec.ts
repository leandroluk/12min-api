import { IAudiobookStatusModel } from '../../domain/models/audiobook-status.model'
import { AudiobookStatus } from '../../domain/models/audiobook.model'
import { IAddAudiobookStatusModel } from '../../domain/use-cases/add-audiobook-status'
import { IAddAudiobookStatusRepository } from '../protocols/add-audiobook-status.repository'
import { DbAddAudiobookStatus } from './db-add-audiobook-status'

const makeAddAudiobookStatusRepository = (): IAddAudiobookStatusRepository => {
  class AddAudiobookStatusRepositoryStub implements IAddAudiobookStatusRepository {
    async addAudiobookStatus(addAudiobookStatus: IAddAudiobookStatusModel): Promise<IAudiobookStatusModel> {
      return await Promise.resolve({
        id: 'id',
        createdAt: new Date(),
        status: AudiobookStatus.PENDING,
        audiobookId: addAudiobookStatus.audiobookId,
        convertAudioFile: addAudiobookStatus.convertAudioFile,
        message: addAudiobookStatus.message
      })
    }
  }
  return new AddAudiobookStatusRepositoryStub()
}

const makeSut = (): {
  addAudiobookStatusRepository: IAddAudiobookStatusRepository
  sut: DbAddAudiobookStatus
  addAudiobookStatus: IAddAudiobookStatusModel
} => {
  const addAudiobookStatusRepository = makeAddAudiobookStatusRepository()
  const sut = new DbAddAudiobookStatus(addAudiobookStatusRepository)
  const addAudiobookStatus: IAddAudiobookStatusModel = {
    audiobookId: 'id',
    status: AudiobookStatus.PENDING
  }

  return {
    addAudiobookStatusRepository,
    sut,
    addAudiobookStatus
  }
}

describe('DbAddAudiobookStatus', () => {
  describe('addAudiobookStatus', () => {
    test('should call IAddAudiobookStatusRepository', async () => {
      const { sut, addAudiobookStatusRepository, addAudiobookStatus } = makeSut()
      const addAudiobookStatusSpy = jest.spyOn(addAudiobookStatusRepository, 'addAudiobookStatus')
      await sut.addAudiobookStatus(addAudiobookStatus)
      expect(addAudiobookStatusSpy).toHaveBeenCalled()
    })

    test('should throw if IAddAudiobookStatusRepository throws', async () => {
      const { sut, addAudiobookStatusRepository } = makeSut()
      jest.spyOn(addAudiobookStatusRepository, 'addAudiobookStatus').mockRejectedValue(new Error())
      await expect(sut.addAudiobookStatus({} as any)).rejects.toThrow()
    })

    test('should return AudiobookStatusModel if is created', async () => {
      const { sut, addAudiobookStatus } = makeSut()
      const result = await sut.addAudiobookStatus(addAudiobookStatus)
      expect(result.id).toBe('id')
      expect(result.createdAt.constructor.name).toBe('Date')
      expect(result.status).toBe('pending')
      expect(result.audiobookId).toBe(addAudiobookStatus.audiobookId)
      expect(result.convertAudioFile).toBe(addAudiobookStatus.convertAudioFile)
      expect(result.message).toBe(addAudiobookStatus.message)
    })
  })
})
