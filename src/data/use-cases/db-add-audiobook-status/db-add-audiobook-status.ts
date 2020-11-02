import { IAudiobookStatusModel } from '../../../domain/models/audiobook-status.model'
import { IAddAudiobookStatus, IAddAudiobookStatusModel } from '../../../domain/use-cases/add-audiobook-status'
import { IAddAudiobookStatusRepository } from '../../protocols/add-audiobook-status.repository'

export class DbAddAudiobookStatus implements IAddAudiobookStatus {
  constructor(
    readonly addAudiobookStatusRepository: IAddAudiobookStatusRepository
  ) { }

  async addAudiobookStatus(addAudiobookStatusModel: IAddAudiobookStatusModel): Promise<IAudiobookStatusModel> {
    return await this.addAudiobookStatusRepository.addAudiobookStatus(addAudiobookStatusModel)
  }
}
