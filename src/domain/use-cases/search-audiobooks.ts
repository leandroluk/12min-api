import { IAudiobookWithLastStatusModel } from '../models/audiobook.model'

export interface ISearchAudiobooksQuery {
  offset?: number
  limit?: number
  title?: string
  description?: string
  tags?: string[]
}

export interface ISearchAudiobooks {
  searchAudiobooks(query: ISearchAudiobooksQuery): Promise<IAudiobookWithLastStatusModel[]>
}
