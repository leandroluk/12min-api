import fs from 'fs'
import path from 'path'
import { IAudiobookStatusModel } from '../../../domain/models/audiobook-status.model'
import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IAddAudiobookStatus, IAddAudiobookStatusModel } from '../../../domain/use-cases/add-audiobook-status'
import { IFindAudiobookToConvert } from '../../../domain/use-cases/find-audiobook-to-convert'
import { ISetAudiobookFilePath } from '../../../domain/use-cases/set-audiobook-file-path'
import FsHelper from '../../../infra/helpers/fs.helper'
import env from '../../../main/config/env'
import { WorkerConvertFile } from './worker-convert-file'

const makeFindAudiobookToConvert = (): IFindAudiobookToConvert => {
  class FindAudiobookToConvertStub implements IFindAudiobookToConvert {
    async findAudiobookToConvert(): Promise<IAudiobookStatusModel> {
      return await Promise.resolve({
        id: 'id',
        audiobookId: 'audiobookId',
        createdAt: new Date(),
        status: AudiobookStatus.PENDING,
        convertAudioFile: path.join(env.app.basePath, 'misc/sample.mp3')
      })
    }
  }
  return new FindAudiobookToConvertStub()
}

const makeAddAudiobookStatus = (): IAddAudiobookStatus => {
  class AddAudiobookStatusStub implements IAddAudiobookStatus {
    async addAudiobookStatus(addAudiobookStatus: IAddAudiobookStatusModel): Promise<IAudiobookStatusModel> {
      return await Promise.resolve({
        id: 'id',
        createdAt: new Date(),
        ...addAudiobookStatus
      })
    }
  }
  return new AddAudiobookStatusStub()
}

const makeSetAudiobookFilePath = (): ISetAudiobookFilePath => {
  class SetAudiobookFilePathStub implements ISetAudiobookFilePath {
    async setAudiobookFilePath(audiobookId: string, filePath: string): Promise<IAudiobookWithLastStatusModel> {
      return await Promise.resolve({
        id: audiobookId,
        createdAt: new Date(),
        status: AudiobookStatus.READY,
        filePath,
        description: 'description',
        title: 'title',
        tags: ['tags']
      })
    }
  }
  return new SetAudiobookFilePathStub()
}

const makeSut = (): {
  findAudiobookToConvert: IFindAudiobookToConvert
  addAudiobookStatus: IAddAudiobookStatus
  setAudiobookFilePath: ISetAudiobookFilePath
  intervalTime: number
  streamsDir: string
  stop: boolean
  sut: WorkerConvertFile
} => {
  const findAudiobookToConvert = makeFindAudiobookToConvert()
  const addAudiobookStatus = makeAddAudiobookStatus()
  const setAudiobookFilePath = makeSetAudiobookFilePath()
  const intervalTime = 0.2
  const streamsDir = path.join(env.app.basePath, env.app.streamsDir)
  const stop = false

  const sut = new WorkerConvertFile(
    findAudiobookToConvert,
    addAudiobookStatus,
    setAudiobookFilePath,
    intervalTime,
    streamsDir,
    stop
  )

  return {
    findAudiobookToConvert,
    addAudiobookStatus,
    setAudiobookFilePath,
    intervalTime,
    streamsDir,
    stop,
    sut
  }
}

const sleep = async (cb: () => void, timeout: number = 300): Promise<void> => {
  await new Promise(resolve => setTimeout(() => { cb(); resolve() }, timeout))
}

describe('WorkerConvertFile', () => {
  describe('convertFile', () => {
    test('should IFindAudiobookToConvert to be called', async () => {
      const { sut, findAudiobookToConvert } = makeSut()
      const findAudiobookToConvertSpy = jest
        .spyOn(findAudiobookToConvert, 'findAudiobookToConvert')
        .mockResolvedValue(null)
      await sut.convertFile()
      expect(findAudiobookToConvertSpy).toHaveBeenCalled()
    })

    test('should throw if IFindAudiobookToConvert throws more than 3 times', async () => {
      const { sut, findAudiobookToConvert } = makeSut()
      const findAudiobookToConvertSpy = jest
        .spyOn(findAudiobookToConvert, 'findAudiobookToConvert')
        .mockRejectedValue(new Error())
      await expect(sut.convertFile()).rejects.toThrow()
      expect(findAudiobookToConvertSpy).toHaveBeenCalledTimes(4)
    })

    test('should IAddAudiobookStatus is called if audiobookStatus is found', async () => {
      const { sut, addAudiobookStatus } = makeSut()
      const addAudiobookStatusSpy = jest.spyOn(addAudiobookStatus, 'addAudiobookStatus')
      await sut.convertFile()
      expect(addAudiobookStatusSpy).toHaveBeenCalled()
    })

    test('should throw if IAddAudiobookStatus throws more than 3 times', async () => {
      const { sut, addAudiobookStatus } = makeSut()
      const addAudiobookStatusSpy = jest
        .spyOn(addAudiobookStatus, 'addAudiobookStatus')
        .mockRejectedValue(new Error())
      await expect(sut.convertFile()).rejects.toThrow()
      expect(addAudiobookStatusSpy).toHaveBeenCalled()
    })

    test('should create streamsDir if not exists', async () => {
      const { sut, streamsDir } = makeSut()
      FsHelper.removeDir(streamsDir)
      jest.spyOn(fs, 'existsSync')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
      const removeDirSpy = jest.spyOn(FsHelper, 'removeDir')
      await sut.convertFile()
      expect(removeDirSpy).toHaveBeenCalled()
    })

    test('should rebuild audiobook folder inner streamsDir if exists to cleanup', async () => {
      const { sut, streamsDir } = makeSut()
      if (!fs.existsSync(streamsDir)) {
        fs.mkdirSync(streamsDir)
      }
      const removeDirSpy = jest.spyOn(FsHelper, 'removeDir')
      const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync')
      await sut.convertFile()
      expect(removeDirSpy).toHaveBeenCalled()
      expect(mkdirSyncSpy).toHaveBeenCalledWith(streamsDir + '/audiobookId')
    })

    test('should child_process.exec to be called to convert audiobook', async () => {
      const { sut, addAudiobookStatus, streamsDir } = makeSut()
      const addAudiobookStatusSpy = jest.spyOn(addAudiobookStatus, 'addAudiobookStatus')
      await sut.convertFile()
      expect(addAudiobookStatusSpy).toHaveBeenCalledWith({
        audiobookId: 'audiobookId',
        status: AudiobookStatus.READY,
        convertAudioFile: streamsDir + '/audiobookId/.m3u8'
      })
    }, 30000)
  })

  describe('run', () => {
    test('should call convertFile', async () => {
      const { sut, findAudiobookToConvert } = makeSut()
      jest.spyOn(findAudiobookToConvert, 'findAudiobookToConvert').mockResolvedValue(null)
      const convertFileSpy = jest.spyOn(sut, 'convertFile')
      sut.run()
      await sleep(() => sut.stop = true)
      expect(convertFileSpy).toHaveBeenCalled()
    })

    test('should stop run if convertFile throw', async () => {
      const { sut } = makeSut()
      jest.spyOn(sut, 'convertFile').mockRejectedValue(new Error())
      await expect(sut.run()).rejects.toThrow()
      expect(sut.stop).toBeTruthy()
    })
  })
})
