import { IAudiobookModel } from '../models/audiobook.model'

export interface IGetAudiobook {
  getAudiobook(audiobookId: string): Promise<IAudiobookModel>
}
