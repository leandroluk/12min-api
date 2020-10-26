import { IAudiobookModel } from '../models/audiobook.model'

export interface IListAudiobooks {
  listAudiobooks(): Promise<IAudiobookModel>
}
