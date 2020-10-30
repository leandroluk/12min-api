import { ILogConvertAudioFileModel } from '../../domain/models/log-convert-audio-file.model'
import { IGetAudiobookStatus } from '../../domain/use-cases/get-audiobook-status'
import { IGetAudiobookStatusRepository } from '../protocols/get-audiobook-status.repository'

export class DbGetAudiobookStatus implements IGetAudiobookStatus {
  constructor(
    readonly getAudiobookStatusRepository: IGetAudiobookStatusRepository
  ) { }

  async getAudiobookStatus(audiobookId: string): Promise<ILogConvertAudioFileModel> {
    return await this.getAudiobookStatusRepository.getAudiobookStatus(audiobookId)
  }
}
