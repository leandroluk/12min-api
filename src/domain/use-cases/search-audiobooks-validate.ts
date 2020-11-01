import { ISearchAudiobooksQuery } from './search-audiobooks'

export interface ISearchAudiobooksValidate {
  validateSearchAudiobooks(searchAudiobooks: ISearchAudiobooksQuery): Promise<any>
}
