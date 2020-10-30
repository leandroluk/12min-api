import { AudiobookStatus } from '../../domain/models/audiobook.model'
import { ILogConvertAudioFileModel } from '../../domain/models/log-convert-audio-file.model'
import { ILogConvertAudioFileInput } from '../../domain/use-cases/log-convert-audio-file'
import { ILogConvertAudioFileRepository } from '../protocols/log-convert-audio-file.repository'
import { DbLogConvertAudioFile } from './db-log-convert-audio-file'

const makeLogConvertAudioFileRepository = (): ILogConvertAudioFileRepository => {
  class LogConvertAudioFileRepositoryStub implements ILogConvertAudioFileRepository {
    async logConvertAudioFile(logConvertAudioFile: ILogConvertAudioFileInput): Promise<ILogConvertAudioFileModel> {
      return await Promise.resolve({
        id: 'id',
        createdAt: new Date(),
        status: AudiobookStatus.PENDING,
        audiobookId: logConvertAudioFile.audiobookId,
        convertAudioFile: logConvertAudioFile.convertAudioFile,
        message: logConvertAudioFile.message
      })
    }
  }
  return new LogConvertAudioFileRepositoryStub()
}

const makeSut = (): {
  logConvertAudioFileRepository: ILogConvertAudioFileRepository
  sut: DbLogConvertAudioFile
  logConvertAudioFile: ILogConvertAudioFileInput
} => {
  const logConvertAudioFileRepository = makeLogConvertAudioFileRepository()
  const sut = new DbLogConvertAudioFile(logConvertAudioFileRepository)
  const logConvertAudioFile: ILogConvertAudioFileInput = {
    audiobookId: 'id',
    status: AudiobookStatus.PENDING
  }

  return {
    logConvertAudioFileRepository,
    sut,
    logConvertAudioFile
  }
}

describe('DbLogConvertAudioFile', () => {
  describe('logConvertAudioFile', () => {
    test('should call ILogConvertAudioFileRepository', async () => {
      const { sut, logConvertAudioFileRepository, logConvertAudioFile } = makeSut()
      const logConvertAudioFileSpy = jest.spyOn(logConvertAudioFileRepository, 'logConvertAudioFile')
      await sut.logConvertAudioFile(logConvertAudioFile)
      expect(logConvertAudioFileSpy).toHaveBeenCalled()
    })

    test('should throw if ILogConvertAudioFileRepository throws', () => {
      const { sut, logConvertAudioFileRepository } = makeSut()
      jest.spyOn(logConvertAudioFileRepository, 'logConvertAudioFile').mockRejectedValue(new Error())
      expect(sut.logConvertAudioFile({} as any)).rejects.toThrow()
    })

    test('should return ILogConvertAudioFileModel if audioblogConvertAudioFileook is created', async () => {
      const { sut, logConvertAudioFile } = makeSut()
      const result = await sut.logConvertAudioFile(logConvertAudioFile)
      expect(result.id).toBe('id')
      expect(result.createdAt.constructor.name).toBe('Date')
      expect(result.status).toBe('pending')
      expect(result.audiobookId).toBe(logConvertAudioFile.audiobookId)
      expect(result.convertAudioFile).toBe(logConvertAudioFile.convertAudioFile)
      expect(result.message).toBe(logConvertAudioFile.message)
    })
  })
})


describe('DbLogConvertAudioFile', () => {
  test('should true', () => { })
})
