import { ISearchAudiobooksQuery } from './search-audiobooks'

export interface ISearchAudiobooksParsedQuery {
  offset: number
  limit: number
  title: string
  description: string
  tags: string[]
}


export interface ISearchAudiobooksParse {
  parseSearchAudiobooks(searchAudiobooks: ISearchAudiobooksQuery): Promise<ISearchAudiobooksParsedQuery>
}
