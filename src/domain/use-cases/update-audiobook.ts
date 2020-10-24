import { IAudiobookModel } from '../models/audiobook.model'

export interface IUpdateAudiobookModel {
  title?: string
  description?: string
  filePath?: string
  tags?: string[]
}

export interface IUpdateAudiobook {
  updateAudiobook(
    audiobookId: string,
    props: IUpdateAudiobookModel
  ): Promise<IAudiobookModel>
}
