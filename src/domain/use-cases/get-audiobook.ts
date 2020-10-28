import { IAudiobookModel } from '../models/audiobook.model'

export interface IGetAudiobook {
  addAudiobook(audiobookId: string): Promise<IAudiobookModel>
}
