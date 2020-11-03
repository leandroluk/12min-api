import { exec } from 'child_process'
import fs from 'fs'
import { IAudiobookStatusModel } from '../../../domain/models/audiobook-status.model'
import { AudiobookStatus } from '../../../domain/models/audiobook.model'
import { IAddAudiobookStatus } from '../../../domain/use-cases/add-audiobook-status'
import { IConvertFile } from '../../../domain/use-cases/convert-file'
import { IFindAudiobookToConvert } from '../../../domain/use-cases/find-audiobook-to-convert'
import { ISetAudiobookFilePath } from '../../../domain/use-cases/set-audiobook-file-path'
import FsHelper from '../../../infra/helpers/fs.helper'
import { IWorker } from '../../protocols/worker'

export class WorkerConvertFile implements IConvertFile, IWorker {
  constructor(
    readonly findAudiobookToConvert: IFindAudiobookToConvert,
    readonly addAudiobookStatus: IAddAudiobookStatus,
    readonly setAudiobookFilePath: ISetAudiobookFilePath,
    readonly intervalTime: number,
    readonly streamsDir: string,
    public stop: boolean = false
  ) { }

  async convertFile(): Promise<void> {
    let findAudiobookToConvertRepositoryThrows = 0
    let convertFileThrows = 0

    const sleep = async (): Promise<void> => {
      await new Promise(resolve => setTimeout(() => resolve(), this.intervalTime * 1000))
    }

    let audiobookStatus: IAudiobookStatusModel

    while (true) {
      try {
        audiobookStatus = await this.findAudiobookToConvert.findAudiobookToConvert()
        break
      } catch (error) {
        if (findAudiobookToConvertRepositoryThrows > 2) {
          throw error
        }
        findAudiobookToConvertRepositoryThrows += 1
        await sleep()
      }
    }

    if (audiobookStatus) {
      while (true) {
        try {
          await this.addAudiobookStatus.addAudiobookStatus({
            audiobookId: audiobookStatus.audiobookId,
            status: AudiobookStatus.CONVERTING
          })

          const convertAudioFileDir = `${this.streamsDir}/${audiobookStatus.audiobookId}`

          if (!fs.existsSync(this.streamsDir)) {
            fs.mkdirSync(this.streamsDir)
          }

          if (fs.existsSync(convertAudioFileDir)) {
            FsHelper.removeDir(convertAudioFileDir)
          }

          fs.mkdirSync(convertAudioFileDir)

          const cmd = [
            `ffmpeg -i ${audiobookStatus.convertAudioFile}`,
            '-c:a aac -b:a 64k -vn -hls_list_size 0',
            `${convertAudioFileDir}/.m3u8`
          ].join(' ')

          await new Promise((resolve, reject) => {
            exec(cmd, (err: Error) => {
              err ? reject(err) : resolve()
            })
          })

          await this.addAudiobookStatus.addAudiobookStatus({
            audiobookId: audiobookStatus.audiobookId,
            status: AudiobookStatus.READY,
            convertAudioFile: convertAudioFileDir + '/.m3u8'
          })

          break
        } catch (error) {
          await this.addAudiobookStatus.addAudiobookStatus({
            audiobookId: audiobookStatus.audiobookId,
            status: AudiobookStatus.PENDING,
            convertAudioFile: audiobookStatus.convertAudioFile,
            message: `${error.message} (tried ${convertFileThrows} times)`
          })

          if (convertFileThrows > 2) {
            throw error
          }

          convertFileThrows += 1
          await sleep()
        }
      }
    } else {
      await sleep()
    }
  }

  async run(): Promise<void> {
    while (!this.stop) {
      try {
        await this.convertFile()
      } catch (error) {
        this.stop = true
        throw error
      }
    }
  }
}
