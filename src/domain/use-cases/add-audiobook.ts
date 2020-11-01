import { IAudiobookWithLastStatusModel } from '../models/audiobook.model'

export interface IAddAudiobookModel {
  title: string
  description: string
  tags: string[]
}

export interface IAddAudiobook {
  addAudiobook(audiobookData: IAddAudiobookModel): Promise<IAudiobookWithLastStatusModel>
}
