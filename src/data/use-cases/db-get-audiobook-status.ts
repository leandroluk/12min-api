import { IAudiobookStatusModel } from '../../domain/models/audiobook-status.model'
import { IGetAudiobookStatus } from '../../domain/use-cases/get-audiobook-status'
import { IGetAudiobookStatusRepository } from '../protocols/get-audiobook-status.repository'

export class DbGetAudiobookStatus implements IGetAudiobookStatus {
  constructor(
    readonly getAudiobookStatusRepository: IGetAudiobookStatusRepository
  ) { }

  async getAudiobookStatus(audiobookId: string): Promise<IAudiobookStatusModel> {
    return await this.getAudiobookStatusRepository.getAudiobookStatus(audiobookId)
  }
}
