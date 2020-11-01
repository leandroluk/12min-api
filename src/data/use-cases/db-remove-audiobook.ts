import { IRemoveAudiobook } from '../../domain/use-cases/remove-audiobook'
import { IRemoveAudiobookRepository } from '../protocols/remove-audiobook.repository'

export class DbRemoveAudiobook implements IRemoveAudiobook {
  constructor(
    readonly removeAudiobookRepository: IRemoveAudiobookRepository
  ) { }

  async removeAudiobook(audiobookId: string): Promise<boolean> {
    return await this.removeAudiobookRepository.removeAudiobook(audiobookId)
  }
}
