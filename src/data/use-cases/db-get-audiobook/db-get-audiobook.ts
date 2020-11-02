import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IGetAudiobook } from '../../../domain/use-cases/get-audiobook'
import { IGetAudiobookRepository } from '../../protocols/get-audiobook.repository'

export class DbGetAudiobook implements IGetAudiobook {
  constructor(
    readonly getAudiobookRepository: IGetAudiobookRepository
  ) { }

  async getAudiobook(audiobookId: string): Promise<IAudiobookWithLastStatusModel> {
    const audiobook = await this.getAudiobookRepository.getAudiobook(audiobookId)

    if (audiobook && !audiobook?.status) {
      audiobook.status = AudiobookStatus.PENDING
    }

    return audiobook
  }
}
