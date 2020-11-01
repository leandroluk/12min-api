import { IAudiobookWithLastStatusModel } from '../../domain/models/audiobook.model'

export interface IGetAudiobookRepository {
  getAudiobook(audiobookId: string): Promise<IAudiobookWithLastStatusModel>
}
