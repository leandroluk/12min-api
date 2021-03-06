import { IAudiobookWithLastStatusModel } from '../models/audiobook.model'

export interface IGetAudiobookParams {
  audiobookId: string
}

export interface IGetAudiobook {
  getAudiobook(audiobookId: string): Promise<IAudiobookWithLastStatusModel>
}
