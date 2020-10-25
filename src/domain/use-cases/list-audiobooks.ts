import { IAudiobookModel } from '@/domain/models/audiobook.model'

export interface IListAudiobooks {
  listAudiobooks(): Promise<IAudiobookModel>
}
