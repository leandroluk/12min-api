import { IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IResultQuery } from '../../../domain/models/result-query.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { ISearchAudiobooks, ISearchAudiobooksParsedQuery, ISearchAudiobooksQuery } from '../../../domain/use-cases/search-audiobooks'
import { ISearchAudiobooksParse } from '../../../domain/use-cases/search-audiobooks-parse'
import { ISearchAudiobooksValidate } from '../../../domain/use-cases/search-audiobooks-validate'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'
import { INullValidator } from '../../protocols/null-validator'
import { SearchAudiobooksController } from './search-audiobooks.controller'


const makeNullValidator = (): INullValidator => {
  class NullValidatorStub implements INullValidator {
    async isNull(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new NullValidatorStub()
}

const makeEmptyValidator = (): IEmptyValidator => {
  class EmptyValidatorStub implements IEmptyValidator {
    async isEmpty(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new EmptyValidatorStub()
}

const makeAccessTokenValidate = (): IAccessTokenValidate => {
  class AccessTokenValidateStub implements IAccessTokenValidate {
    async validateAccessToken(_accessToken: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new AccessTokenValidateStub()
}

const makeSearchAudiobooksValidate = (): ISearchAudiobooksValidate => {
  class SearchAudiobooksValidateStub implements ISearchAudiobooksValidate {
    async validateSearchAudiobooks(_query: ISearchAudiobooksQuery): Promise<any> {
      return await Promise.resolve({})
    }
  }
  return new SearchAudiobooksValidateStub()
}

const makeSearchAudiobooksParse = (): ISearchAudiobooksParse => {
  class SearchAudiobooksParseStub implements ISearchAudiobooksParse {
    async parseSearchAudiobooks(_searchAudiobooks: ISearchAudiobooksQuery): Promise<ISearchAudiobooksParsedQuery> {
      return await Promise.resolve({
        description: 'description',
        limit: 1,
        offset: 1,
        tags: ['tags'],
        title: 'title'
      })
    }
  }
  return new SearchAudiobooksParseStub()
}

const makeSearchAudiobooks = (): ISearchAudiobooks => {
  class SearchAudiobooksStub implements ISearchAudiobooks {
    async searchAudiobooks(query: ISearchAudiobooksParsedQuery): Promise<IResultQuery<IAudiobookWithLastStatusModel>> {
      return await Promise.resolve({
        limit: 0,
        offset: 0,
        total: 0,
        items: []
      })
    }
  }
  return new SearchAudiobooksStub()
}

const makeSut = (): {
  nullValidator: INullValidator
  emptyValidator: IEmptyValidator
  accessTokenValidate: IAccessTokenValidate
  searchAudiobooksValidate: ISearchAudiobooksValidate
  searchAudiobookxParse: ISearchAudiobooksParse
  searchAudiobooks: ISearchAudiobooks
  sut: SearchAudiobooksController
  httpRequest: IHttpRequest
} => {
  const nullValidator = makeNullValidator()
  const emptyValidator = makeEmptyValidator()
  const accessTokenValidate = makeAccessTokenValidate()
  const searchAudiobooksValidate = makeSearchAudiobooksValidate()
  const searchAudiobookxParse = makeSearchAudiobooksParse()
  const searchAudiobooks = makeSearchAudiobooks()
  const sut = new SearchAudiobooksController(
    nullValidator,
    emptyValidator,
    accessTokenValidate,
    searchAudiobooksValidate,
    searchAudiobookxParse,
    searchAudiobooks
  )
  const httpRequest: IHttpRequest = { header: {}, query: {} }

  return {
    nullValidator,
    emptyValidator,
    accessTokenValidate,
    searchAudiobooksValidate,
    searchAudiobookxParse,
    searchAudiobooks,
    sut,
    httpRequest
  }
}

describe('SearchAudiobooksController', () => {
  test('should call IEmptyValidator', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    const isEmptySpy = jest.spyOn(emptyValidator, 'isEmpty')
    await sut.handle(httpRequest)
    expect(isEmptySpy).toHaveBeenCalled()
  })

  test('should call IAccessTokenValidate', async () => {
    const { sut, accessTokenValidate, httpRequest } = makeSut()
    const validateAccessTokenSpy = jest.spyOn(accessTokenValidate, 'validateAccessToken')
    await sut.handle(httpRequest)
    expect(validateAccessTokenSpy).toHaveBeenCalled()
  })

  test('should return 401 if no access token or invalid', async () => {
    const { sut, emptyValidator, accessTokenValidate, httpRequest } = makeSut()
    let result: IHttpResponse

    jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValueOnce(true)
    result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(401)
    expect(result.body.message).toMatch(/Unauthorized.*?/)

    jest.spyOn(accessTokenValidate, 'validateAccessToken').mockResolvedValueOnce(false)
    result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(401)
    expect(result.body.message).toMatch(/Unauthorized.*?/)
  })

  test('should call INullValidator', async () => {
    const { sut, nullValidator, httpRequest } = makeSut()
    const isNullSpy = jest.spyOn(nullValidator, 'isNull')
    await sut.handle(httpRequest)
    expect(isNullSpy).toHaveBeenCalled()
  })

  test('should return 400 if query is null', async () => {
    const { sut, nullValidator, httpRequest } = makeSut()
    jest.spyOn(nullValidator, 'isNull').mockResolvedValue(true)
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(400)
  })

  test('should call ISearchAudiobooksValidate', async () => {
    const { sut, searchAudiobooksValidate, httpRequest } = makeSut()
    const validateSearchAudiobooksSpy = jest.spyOn(searchAudiobooksValidate, 'validateSearchAudiobooks')
    await sut.handle(httpRequest)
    expect(validateSearchAudiobooksSpy).toHaveBeenCalled()
  })

  test('should return 400 if have some error in query', async () => {
    const { sut, searchAudiobooksValidate: searchAudiobooksValidator } = makeSut()
    jest.spyOn(searchAudiobooksValidator, 'validateSearchAudiobooks').mockResolvedValue({
      limit: new Error()
    })
    const result = await sut.handle({ query: { limit: 'asd' } } as any)
    expect(result.statusCode).toBe(400)
    expect(result.body.message).toMatch(/Object validation.*?/)
    expect(result.body.errors.limit).toBeDefined()
  })

  test('should call ISearchAudiobooksParse', async () => {
    const { sut, searchAudiobookxParse, httpRequest } = makeSut()
    const parseSearchAudiobooksSpy = jest.spyOn(searchAudiobookxParse, 'parseSearchAudiobooks')
    await sut.handle(httpRequest)
    expect(parseSearchAudiobooksSpy).toHaveBeenCalled()
  })

  test('should call ISearchAudiobooksParse', async () => {
    const { sut, searchAudiobookxParse, httpRequest } = makeSut()
    const parseSearchAudiobooksSpy = jest.spyOn(searchAudiobookxParse, 'parseSearchAudiobooks')
    await sut.handle(httpRequest)
    expect(parseSearchAudiobooksSpy).toHaveBeenCalled()
  })

  test('should call ISearchAudiobooks', async () => {
    const { sut, searchAudiobooks, httpRequest } = makeSut()
    const searchAudiobooksSpy = jest.spyOn(searchAudiobooks, 'searchAudiobooks')
    await sut.handle(httpRequest)
    expect(searchAudiobooksSpy).toHaveBeenCalled()
  })

  test('should return 400 if ISearchAudiobooks throw invalid param error', async () => {
    const { sut, searchAudiobooks, httpRequest } = makeSut()
    jest.spyOn(searchAudiobooks, 'searchAudiobooks').mockRejectedValue(new InvalidParamError('param'))
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(400)
  })

  test('should return 500 if ISearchAudiobooks throw any other error', async () => {
    const { sut, searchAudiobooks, httpRequest } = makeSut()
    jest.spyOn(searchAudiobooks, 'searchAudiobooks').mockRejectedValue(new Error())
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(500)
  })

  test('should return 200 with IResultQuery if success', async () => {
    const { sut, httpRequest } = makeSut()
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body.limit).toBeDefined()
    expect(result.body.offset).toBeDefined()
    expect(result.body.total).toBeDefined()
    expect(result.body.items).toBeDefined()
  })

  test('should return 200 if query isn\'t defined', async () => {
    const { sut } = makeSut()
    const result = await sut.handle({ header: {} })
    expect(result.statusCode).toBe(200)
  })
})
