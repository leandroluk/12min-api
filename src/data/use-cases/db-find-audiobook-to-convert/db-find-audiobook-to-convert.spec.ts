import { IAudiobookStatusModel } from '../../../domain/models/audiobook-status.model'
import { AudiobookStatus } from '../../../domain/models/audiobook.model'
import { IFindAudiobookToConvertRepository } from '../../protocols/find-audiobook-to-convert.repository'
import { DbFindAudiobookToConvert } from './db-find-audiobook-to-convert'

const makeFindAudiobookToConvertRepository = (): IFindAudiobookToConvertRepository => {
  class FindAudiobookToConvertRepositoryStub implements IFindAudiobookToConvertRepository {
    async findAudiobookToConvert(): Promise<IAudiobookStatusModel> {
      return await Promise.resolve({
        id: 'id',
        audiobookId: 'audiobookId',
        createdAt: new Date(),
        status: AudiobookStatus.PENDING,
        convertAudioFile: 'path/to/file.mp3'
      })
    }
  }
  return new FindAudiobookToConvertRepositoryStub()
}

const makeSut = (): {
  findAudiobookToConvertRepository: IFindAudiobookToConvertRepository
  sut: DbFindAudiobookToConvert
} => {
  const findAudiobookToConvertRepository = makeFindAudiobookToConvertRepository()
  const sut = new DbFindAudiobookToConvert(findAudiobookToConvertRepository)

  return {
    findAudiobookToConvertRepository,
    sut
  }
}

describe('DbFindAudiobookToConvert', () => {
  test('should IFindAudiobookToConvertRepository to be called', async () => {
    const { sut, findAudiobookToConvertRepository } = makeSut()
    const findAudiobookToConvertSpy = jest.spyOn(findAudiobookToConvertRepository, 'findAudiobookToConvert')
    await sut.findAudiobookToConvert()
    expect(findAudiobookToConvertSpy).toHaveBeenCalled()
  })

  test('should throw if IFindAudiobookToConvertRepository throws', async () => {
    const { sut, findAudiobookToConvertRepository } = makeSut()
    jest.spyOn(findAudiobookToConvertRepository, 'findAudiobookToConvert').mockRejectedValue(new Error())
    await expect(sut.findAudiobookToConvert()).rejects.toThrow()
  })

  test('should return null if no have audiobook file to convert', async () => {
    const { sut, findAudiobookToConvertRepository } = makeSut()
    jest.spyOn(findAudiobookToConvertRepository, 'findAudiobookToConvert').mockResolvedValue(null)
    await expect(sut.findAudiobookToConvert()).resolves.toBeFalsy()
  })

  test('should return a IAudiobookStatusModel if has audiobook to convert', async () => {
    const { sut } = makeSut()
    const result = await sut.findAudiobookToConvert()
    expect(result.id).toBeDefined()
    expect(result.audiobookId).toBeDefined()
    expect(result.convertAudioFile).toBeDefined()
    expect(result.status).toBe(AudiobookStatus.PENDING)
  })
})
