import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IGetAudiobook } from '../../../domain/use-cases/get-audiobook'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest } from '../../protocols/http'
import { GetAudiobookController } from './get-audiobook.controller'

const makeEmptyValidator = (): IEmptyValidator => {
  class EmptyValidatorStub implements IEmptyValidator {
    async isEmpty(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new EmptyValidatorStub()
}

const makeAccessTokenValidator = (): IAccessTokenValidate => {
  class AccessTokenValidateStub implements IAccessTokenValidate {
    async validateAccessToken(_accessToken: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new AccessTokenValidateStub()
}

const makeGetAudiobook = (): IGetAudiobook => {
  class GetAudiobookStub implements IGetAudiobook {
    async getAudiobook(audiobookId: string): Promise<IAudiobookWithLastStatusModel> {
      return await Promise.resolve({
        id: audiobookId,
        createdAt: new Date(),
        title: 'title',
        description: 'description',
        status: AudiobookStatus.PENDING,
        tags: ['tags']
      })
    }
  }
  return new GetAudiobookStub()
}

const makeSut = (): {
  emptyValidator: IEmptyValidator
  accessTokenValidate: IAccessTokenValidate
  getAudiobook: IGetAudiobook
  sut: GetAudiobookController
  httpRequest: IHttpRequest
} => {
  const emptyValidator = makeEmptyValidator()
  const accessTokenValidate = makeAccessTokenValidator()
  const getAudiobook = makeGetAudiobook()
  const sut = new GetAudiobookController(
    emptyValidator,
    accessTokenValidate,
    getAudiobook
  )
  const httpRequest: IHttpRequest = {
    header: { authorization: 'Bearer token' },
    params: { audiobookId: 'audiobookId' }
  }

  return {
    emptyValidator,
    accessTokenValidate,
    getAudiobook,
    sut,
    httpRequest
  }
}

describe('GetAudiobookController', () => {
  test('should IEmptyValidator to be called', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    const isEmptySpy = jest.spyOn(emptyValidator, 'isEmpty')
    await sut.handle(httpRequest)
    expect(isEmptySpy).toBeCalled()
  })

  test('should IAccecssTokenValidate to be called', async () => {
    const { sut, accessTokenValidate, httpRequest } = makeSut()
    const validateAccessTokenSpy = jest.spyOn(accessTokenValidate, 'validateAccessToken')
    await sut.handle(httpRequest)
    expect(validateAccessTokenSpy).toBeCalled()
  })

  test('should return 401 with unauthorized error if no access token on header', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValue(true)
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(401)
    expect(result.body.message).toMatch(/Unauthorized.*?/)
  })

  test('should throw if IEmptyValidator throws', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockRejectedValue(new Error())
    await expect(sut.handle(httpRequest)).rejects.toThrow()
  })

  test('should return 401 with unauthorized error if access token is invalid', async () => {
    const { sut, accessTokenValidate, httpRequest } = makeSut()
    jest.spyOn(accessTokenValidate, 'validateAccessToken').mockResolvedValue(false)
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(401)
    expect(result.body.message).toMatch(/Unauthorized.*?/)
  })

  test('should throw if IAccecssTokenValidate throws', async () => {
    const { sut, accessTokenValidate, httpRequest } = makeSut()
    jest.spyOn(accessTokenValidate, 'validateAccessToken').mockRejectedValue(new Error())
    await expect(sut.handle(httpRequest)).rejects.toThrow()
  })

  test('should return 400 if audiobookId is no provided as param', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()

    jest.spyOn(emptyValidator, 'isEmpty')
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)

    const result = await sut.handle({ ...httpRequest, params: {} } as any)
    expect(result.statusCode).toBe(400)
    expect(result.body.message).toMatch(/Missing param.*?/)
  })

  test('should IGetAudiobook to be called', async () => {
    const { sut, getAudiobook, httpRequest } = makeSut()
    const getAudiobookSpy = jest.spyOn(getAudiobook, 'getAudiobook')
    await sut.handle(httpRequest)
    expect(getAudiobookSpy).toBeCalled()
  })

  test('should return 500 if if IGetAudiobook throws', async () => {
    const { sut, getAudiobook, httpRequest } = makeSut()
    jest.spyOn(getAudiobook, 'getAudiobook').mockRejectedValue(new Error())
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body.message).toMatch(/Server error/)
  })

  test('should return 200 with audiobook model if success', async () => {
    const { sut, httpRequest } = makeSut()
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body.id).toBe(httpRequest.params.audiobookId)
    expect(result.body.createdAt).toBeTruthy()
    expect(result.body.title).toBeTruthy()
    expect(result.body.description).toBeTruthy()
    expect(result.body.status).toBeTruthy()
    expect(result.body.tags).toBeTruthy()
  })

  test('should return 404 if audiobook not found', async () => {
    const { sut, getAudiobook, httpRequest } = makeSut()
    jest.spyOn(getAudiobook, 'getAudiobook').mockResolvedValue(undefined)
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(404)
    expect(result.body.message).toMatch(/No data found.*?/)
  })
})
