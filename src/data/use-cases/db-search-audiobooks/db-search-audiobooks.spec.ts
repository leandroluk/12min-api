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
} => {
  const searchAudiobooksRepository = makeSearchAudiobooksRepository()
  const sut = new DbSearchAudiobooks(searchAudiobooksRepository)

  return {
    searchAudiobooksRepository,
    sut
  }
}

describe('DbSearchAudiobooks', () => {
  test('should call ISearchAudiobooksRepository with correct values', async () => {
    const { sut, searchAudiobooksRepository } = makeSut()
    const searchAudiobooksSpy = jest.spyOn(searchAudiobooksRepository, 'searchAudiobooks')
    await sut.searchAudiobooks({} as any)
    expect(searchAudiobooksSpy).toHaveBeenCalledWith({})
  })

  test('should throw if ISearchAudiobooksRepository throws', async () => {
    const { sut, searchAudiobooksRepository } = makeSut()
    jest.spyOn(searchAudiobooksRepository, 'searchAudiobooks').mockRejectedValue(new Error())
    await expect(sut.searchAudiobooks({} as any)).rejects.toThrow()
  })

  test('should return IResultQuery if success', async () => {
    const { sut } = makeSut()
    const result = await sut.searchAudiobooks({} as any)
    expect(result.limit).toBe(0)
    expect(result.offset).toBe(0)
    expect(result.total).toBe(0)
    expect(result.items).toEqual([])
  })
})
