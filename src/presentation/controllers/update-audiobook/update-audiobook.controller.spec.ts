import { IAudiobookStatusModel } from '../../../domain/models/audiobook-status.model'
import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IAuthenticatedHeaderModel } from '../../../domain/models/authenticated-header.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IAddAudiobookStatus, IAddAudiobookStatusModel } from '../../../domain/use-cases/add-audiobook-status'
import { IConvertFileValidate } from '../../../domain/use-cases/convert-file-validate'
import { IGetAudiobook } from '../../../domain/use-cases/get-audiobook'
import { IUpdateAudiobook, IUpdateAudiobookModel } from '../../../domain/use-cases/update-audiobook'
import { IUpdateAudiobookValidate } from '../../../domain/use-cases/update-audiobook-validate'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest } from '../../protocols/http'
import { UpdateAudiobookController } from './update-audiobook.controller'

const makeAccessTokenValidator = (): IAccessTokenValidate => {
  class AccessTokenValidatorStub implements IAccessTokenValidate {
    async validateAccessToken(_accessToken: any): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new AccessTokenValidatorStub()
}

const makeEmptyValidator = (): IEmptyValidator => {
  class EmptyValidatorStub implements IEmptyValidator {
    async isEmpty(_value: any): Promise<boolean> {
      return await Promise.resolve(false)
    }
  }
  return new EmptyValidatorStub()
}

const makeUpdateAudiobook = (): IUpdateAudiobook => {
  class UpdateAudiobookStub implements IUpdateAudiobook {
    async updateAudiobook(audiobookId: string, audiobookData: IUpdateAudiobookModel): Promise<IAudiobookWithLastStatusModel> {
      return await Promise.resolve({
        id: audiobookId,
        createdAt: new Date(),
        title: audiobookData.title || 'title',
        description: audiobookData.description || 'description',
        tags: audiobookData.tags || ['tags'],
        status: AudiobookStatus.PENDING
      })
    }
  }
  return new UpdateAudiobookStub()
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

const makeAddAudiobookStatus = (): IAddAudiobookStatus => {
  class AddAudiobookStatusStub implements IAddAudiobookStatus {
    async addAudiobookStatus(addAudiobookStatus: IAddAudiobookStatusModel): Promise<IAudiobookStatusModel> {
      return await Promise.resolve({
        id: 'id',
        createdAt: new Date(),
        status: addAudiobookStatus.status,
        audiobookId: addAudiobookStatus.audiobookId,
        convertAudioFile: addAudiobookStatus.convertAudioFile,
        message: addAudiobookStatus.message
      })
    }
  }
  return new AddAudiobookStatusStub()
}

const makeUpdateAudiobookValidate = (): IUpdateAudiobookValidate => {
  class UpdateAudiobookValidateStub implements IUpdateAudiobookValidate {
    async validateUpdateAudiobook(_updateAudiobook: IUpdateAudiobookModel): Promise<any> {
      return await Promise.resolve({})
    }
  }
  return new UpdateAudiobookValidateStub()
}

const makeConvertAudioFileValidate = (): IConvertFileValidate => {
  class ConvertAudioFileValidateStub implements IConvertFileValidate {
    async validateConvertFile(_convertAudioFile: string): Promise<Error> {
      return await Promise.resolve(null)
    }
  }
  return new ConvertAudioFileValidateStub()
}

const makeSut = (): {
  emptyValidator: IEmptyValidator
  accessTokenValidator: IAccessTokenValidate
  updateAudiobookValidate: IUpdateAudiobookValidate
  convertAudioFileValidate: IConvertFileValidate
  getAudiobook: IGetAudiobook
  updateAudiobook: IUpdateAudiobook
  addAudiobookStatus: IAddAudiobookStatus
  sut: UpdateAudiobookController
  httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IUpdateAudiobookModel, string>
} => {
  const emptyValidator = makeEmptyValidator()
  const accessTokenValidator = makeAccessTokenValidator()
  const updateAudiobookValidate = makeUpdateAudiobookValidate()
  const convertAudioFileValidate = makeConvertAudioFileValidate()
  const getAudiobook = makeGetAudiobook()
  const updateAudiobook = makeUpdateAudiobook()
  const addAudiobookStatus = makeAddAudiobookStatus()
  const sut = new UpdateAudiobookController(
    emptyValidator,
    accessTokenValidator,
    updateAudiobookValidate,
    convertAudioFileValidate,
    getAudiobook,
    updateAudiobook,
    addAudiobookStatus
  )
  const httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IUpdateAudiobookModel, string> = {
    header: {
      authorization: 'token'
    },
    body: {
      title: 'title',
      description: 'description',
      tags: ['tags']
    },
    file: 'path/to/file.mp3',
    params: {
      audiobookId: 'audiobookId'
    }
  }

  return {
    emptyValidator,
    accessTokenValidator,
    updateAudiobookValidate,
    convertAudioFileValidate,
    getAudiobook,
    updateAudiobook,
    addAudiobookStatus,
    sut,
    httpRequest
  }
}

describe('UpdateAudiobookController', () => {
  test('should IEmptyValidator to be called', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    const isEmptySpy = jest.spyOn(emptyValidator, 'isEmpty')
    await sut.handle(httpRequest)
    expect(isEmptySpy).toHaveBeenCalled()
  })

  test('should return 401 if no access token is provided on header', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValue(true)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.message).toMatch(/Unauthorized.*accessToken.*?/)
  })

  test('should IAccessTokenValidate to be called', async () => {
    const { sut, accessTokenValidator, httpRequest } = makeSut()
    const validateAccessTokenSpy = jest.spyOn(accessTokenValidator, 'validateAccessToken')
    await sut.handle(httpRequest)
    expect(validateAccessTokenSpy).toHaveBeenCalled()
  })

  test('should return 401 if access token is invalid or expired', async () => {
    const { sut, accessTokenValidator, httpRequest } = makeSut()
    jest.spyOn(accessTokenValidator, 'validateAccessToken').mockResolvedValue(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.message).toMatch(/Unauthorized.*accessToken.*?/)
  })

  test('should return 400 if body is no provided', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValueOnce(false).mockResolvedValueOnce(true)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toMatch(/Missing param.*body.*?/)
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

  test('should call IGetAudiobook', async () => {
    const { sut, getAudiobook, httpRequest } = makeSut()
    const getAudiobookSpy = jest.spyOn(getAudiobook, 'getAudiobook')
    await sut.handle(httpRequest)
    expect(getAudiobookSpy).toHaveBeenCalled()
  })

  test('should return 404 if no found audiobook with passed id', async () => {
    const { sut, getAudiobook, httpRequest } = makeSut()
    jest.spyOn(getAudiobook, 'getAudiobook').mockResolvedValue(null)
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(404)
    expect(result.body.message).toMatch(/No data found.*?/)
  })

  test('should call IUpdateAudiobook if audiobook found', async () => {
    const { sut, updateAudiobook, httpRequest } = makeSut()
    const updateAudiobookSpy = jest.spyOn(updateAudiobook, 'updateAudiobook')
    await sut.handle(httpRequest)
    expect(updateAudiobookSpy).toBeCalled()
  })

  test('should call IAddAudiobookStatus if has file and add a new file to convert', async () => {
    const { sut, addAudiobookStatus, httpRequest } = makeSut()
    const addAudiobookStatusSpy = jest.spyOn(addAudiobookStatus, 'addAudiobookStatus')
    await sut.handle(httpRequest)
    expect(addAudiobookStatusSpy).toBeCalled()
  })

  test('should return 200 with updated audiobook', async () => {
    const { sut, httpRequest } = makeSut()
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body).toBeDefined()
  })
})
