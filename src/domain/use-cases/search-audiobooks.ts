import { IAudiobookWithLastStatusModel } from '../models/audiobook.model'
import { IResultQuery } from '../models/result-query.model'

export interface ISearchAudiobooksQuery {
  offset?: string
  limit?: string
  title?: string
  description?: string
  tags?: string
}

export interface ISearchAudiobooksParsedQuery {
  offset: number
  limit: number
  title: string
  description: string
  tags: string[]
}

export interface ISearchAudiobooks {
  searchAudiobooks(query: ISearchAudiobooksParsedQuery): Promise<IResultQuery<IAudiobookWithLastStatusModel>>
}
