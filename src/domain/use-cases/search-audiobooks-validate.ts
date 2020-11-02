import { ISearchAudiobooksQuery } from './search-audiobooks'

export interface ISearchAudiobooksValidate {
  validateSearchAudiobooks(query: ISearchAudiobooksQuery): Promise<any>
}
