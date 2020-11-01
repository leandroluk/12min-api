import { IAudiobookStatusModel } from '../models/audiobook-status.model'

export interface IGetAudiobookStatus {
  getAudiobookStatus(audiobookId: string): Promise<IAudiobookStatusModel>
}
