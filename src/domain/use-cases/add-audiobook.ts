import { IAudiobookModel } from '../models/audiobook.model'

export interface IAddAudiobookModel {
  title: string
  description: string
  tags: string[]
}

export interface IAddAudiobook {
  addAudiobook(
    audiobook: IAddAudiobookModel
  ): Promise<IAudiobookModel>
}
