import { IAudiobookStatusModel } from '../../domain/models/audiobook-status.model'

export interface IGetAudiobookStatusRepository {
  getAudiobookStatus(audiobookId: string): Promise<IAudiobookStatusModel>
}
