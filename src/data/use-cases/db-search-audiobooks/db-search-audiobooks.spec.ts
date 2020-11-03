import { IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IResultQuery } from '../../../domain/models/result-query.model'
import { ISearchAudiobooksParsedQuery } from '../../../domain/use-cases/search-audiobooks'
import { ISearchAudiobooksRepository } from '../../protocols/search-audiobooks.repository'
import { DbSearchAudiobooks } from './db-search-audiobooks'

const makeSearchAudiobooksRepository = (): ISearchAudiobooksRepository => {
  class SearchAudiobooksRepositoryStub implements ISearchAudiobooksRepository {
    async searchAudiobooks(query: ISearchAudiobooksParsedQuery): Promise<IResultQuery<IAudiobookWithLastStatusModel>> {
      return await Promise.resolve({
        limit: 0,
        offset: 0,
        total: 0,
        items: []
      })
    }
  }
  return new SearchAudiobooksRepositoryStub()
}

const makeSut = (): {
  searchAudiobooksRepository: ISearchAudiobooksRepository
  sut: DbSearchAudiobooks
  query: ISearchAudiobooksParsedQuery
} => {
  const searchAudiobooksRepository = makeSearchAudiobooksRepository()
  const sut = new DbSearchAudiobooks(searchAudiobooksRepository)
  const query: ISearchAudiobooksParsedQuery = {
    description: '',
    limit: 50,
    offset: 0,
    title: '',
    tags: []
  }

  return {
    searchAudiobooksRepository,
    sut,
    query
  }
}

describe('DbSearchAudiobooks', () => {
  describe('searchAudiobooks', () => {
    test('should call ISearchAudiobooksRepository with correct values', async () => {
      const { sut, searchAudiobooksRepository, query } = makeSut()
      const searchAudiobooksSpy = jest.spyOn(searchAudiobooksRepository, 'searchAudiobooks')
      await sut.searchAudiobooks(query)
      expect(searchAudiobooksSpy).toHaveBeenCalledWith(query)
    })

    test('should throw if ISearchAudiobooksRepository throws', async () => {
      const { sut, searchAudiobooksRepository, query } = makeSut()
      jest.spyOn(searchAudiobooksRepository, 'searchAudiobooks').mockRejectedValue(new Error())
      await expect(sut.searchAudiobooks(query)).rejects.toThrow()
    })

    test('should return ResultQuery with results', async () => {
      const { sut, query } = makeSut()
      const result = await sut.searchAudiobooks(query)

      expect(result).toBeTruthy()
      expect(result.limit).toBe(0)
      expect(result.offset).toBe(0)
      expect(result.items).toEqual([])
      expect(result.total).toBe(0)
    })
  })
})
