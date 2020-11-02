import { ISearchAudiobooksParsedQuery, ISearchAudiobooksQuery } from './search-audiobooks'

export interface ISearchAudiobooksParse {
  parseSearchAudiobooks(searchAudiobooks: ISearchAudiobooksQuery): Promise<ISearchAudiobooksParsedQuery>
}
