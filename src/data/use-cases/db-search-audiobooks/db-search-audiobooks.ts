import { IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IResultQuery } from '../../../domain/models/result-query.model'
import { ISearchAudiobooks, ISearchAudiobooksParsedQuery } from '../../../domain/use-cases/search-audiobooks'
import { ISearchAudiobooksRepository } from '../../protocols/search-audiobooks.repository'

export class DbSearchAudiobooks implements ISearchAudiobooks {
  constructor(
    readonly searchAudiobooksRepository: ISearchAudiobooksRepository
  ) { }

  async searchAudiobooks(query: ISearchAudiobooksParsedQuery): Promise<IResultQuery<IAudiobookWithLastStatusModel>> {
    return await this.searchAudiobooksRepository.searchAudiobooks(query)
  }
}
