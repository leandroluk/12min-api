import { IAudiobookModel } from '@/domain/models/audiobook.model'

export interface IAddAudiobookModel {
  title: string
  description: string
  filePath: string
  tags: string[]
}

export interface IAddAudiobook {
  addAudiobook(
    audiobook: IAddAudiobookModel
  ): Promise<IAudiobookModel>
}