import { AudiobookStatus, IAudiobookModel } from '../models/audiobook.model'

export interface IAddAudiobookModel {
  title: string
  description: string
  tags: string[]
}

export interface IAddAudiobookReturn extends IAudiobookModel {
  status: AudiobookStatus
}

export interface IAddAudiobook {
  addAudiobook(audiobookData: IAddAudiobookModel): Promise<IAddAudiobookReturn>
}
