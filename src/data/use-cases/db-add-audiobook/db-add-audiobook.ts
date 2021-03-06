import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IAddAudiobook, IAddAudiobookModel } from '../../../domain/use-cases/add-audiobook'
import { IAddAudiobookRepository } from '../../protocols/add-audiobook.repository'

export class DbAddAudiobook implements IAddAudiobook {
  constructor(
    readonly addAudiobookRepository: IAddAudiobookRepository
  ) { }

  async addAudiobook(audiobookData: IAddAudiobookModel): Promise<IAudiobookWithLastStatusModel> {
    const data = {
      ...audiobookData,
      tags: [...new Set(audiobookData.tags)]
    }

    const audiobook = await this.addAudiobookRepository.addAudiobook(data)

    return {
      ...audiobook,
      status: AudiobookStatus.PENDING
    }
  }
}
