import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IRemoveAudiobook } from '../../../domain/use-cases/remove-audiobook'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest } from '../../protocols/http'
import { RemoveAudiobookController } from './remove-audiobook.controller'

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

const makeRemoveAudiobook = (): IRemoveAudiobook => {
  class RemoveAudiobookStub implements IRemoveAudiobook {
    async removeAudiobook(_audiobookId: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new RemoveAudiobookStub()
}

const makeSut = (): {
  emptyValidator: IEmptyValidator
  accessTokenValidate: IAccessTokenValidate
  removeAudiobook: IRemoveAudiobook
  sut: RemoveAudiobookController
  httpRequest: IHttpRequest
} => {
  const emptyValidator = makeEmptyValidator()
  const accessTokenValidate = makeAccessTokenValidator()
  const removeAudiobook = makeRemoveAudiobook()
  const sut = new RemoveAudiobookController(
    emptyValidator,
    accessTokenValidate,
    removeAudiobook
  )
  const httpRequest: IHttpRequest = {
    header: { authorization: 'Bearer token' },
    params: { audiobookId: 'audiobookId' }
  }

  return {
    emptyValidator,
    accessTokenValidate,
    removeAudiobook,
    sut,
    httpRequest
  }
}

describe('RemoveAudiobookController', () => {
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

  test('should IRemoveAudiobook to be called', async () => {
    const { sut, removeAudiobook, httpRequest } = makeSut()
    const removeAudiobookSpy = jest.spyOn(removeAudiobook, 'removeAudiobook')
    await sut.handle(httpRequest)
    expect(removeAudiobookSpy).toBeCalled()
  })

  test('should return 500 if IRemoveAudiobook throws', async () => {
    const { sut, removeAudiobook, httpRequest } = makeSut()
    jest.spyOn(removeAudiobook, 'removeAudiobook').mockRejectedValue(new Error())
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body.message).toMatch(/Server error/)
  })

  test('should return 200 if audiobook is removed', async () => {
    const { sut, httpRequest } = makeSut()
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(200)
  })

  test('should return 404 if audiobook not found', async () => {
    const { sut, removeAudiobook, httpRequest } = makeSut()
    jest.spyOn(removeAudiobook, 'removeAudiobook').mockResolvedValue(false)
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(404)
    expect(result.body.message).toMatch(/No data found.*?/)
  })

  test('should return 404 if IRemoveAudiobook throws Invalid param audiobookId', async () => {
    const { sut, removeAudiobook, httpRequest } = makeSut()
    jest.spyOn(removeAudiobook, 'removeAudiobook').mockRejectedValue(new InvalidParamError('audiobookId'))
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(404)
    expect(result.body.message).toMatch(/No data found.*?/)
  })
})
