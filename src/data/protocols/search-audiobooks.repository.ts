import { IAudiobookWithLastStatusModel } from '../../domain/models/audiobook.model'
import { IResultQuery } from '../../domain/models/result-query.model'
import { ISearchAudiobooksParsedQuery } from '../../domain/use-cases/search-audiobooks'

export interface ISearchAudiobooksRepository {
  searchAudiobooks(query: ISearchAudiobooksParsedQuery): Promise<IResultQuery<IAudiobookWithLastStatusModel>>
}
