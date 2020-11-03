import { IAudiobookWithLastStatusModel } from '../models/audiobook.model'

export interface IUpdateAudiobookModel {
  title?: string
  description?: string
  tags?: string[]
}

export interface IUpdateAudiobook {
  updateAudiobook(audiobookId: string, audiobookData: IUpdateAudiobookModel): Promise<IAudiobookWithLastStatusModel>
}
