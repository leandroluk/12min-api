import { IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IUpdateAudiobook, IUpdateAudiobookModel } from '../../../domain/use-cases/update-audiobook'
import { IUpdateAudiobookRepository } from '../../protocols/update-audiobook.repository'

export class DbUpdateAudiobook implements IUpdateAudiobook {
  constructor(
    readonly updateAudiobookRepository: IUpdateAudiobookRepository
  ) { }

  async updateAudiobook(audiobookId: string, audiobookData: IUpdateAudiobookModel): Promise<IAudiobookWithLastStatusModel> {
    return await this.updateAudiobookRepository.updateAudiobook(audiobookId, audiobookData)
  }
}
