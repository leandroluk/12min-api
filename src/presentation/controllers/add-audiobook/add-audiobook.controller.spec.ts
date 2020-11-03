import { IAudiobookStatusModel } from '../../../domain/models/audiobook-status.model'
import { AudiobookStatus, IAudiobookWithLastStatusModel } from '../../../domain/models/audiobook.model'
import { IAuthenticatedHeaderModel } from '../../../domain/models/authenticated-header.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IAddAudiobook, IAddAudiobookModel } from '../../../domain/use-cases/add-audiobook'
import { IAddAudiobookStatus, IAddAudiobookStatusModel } from '../../../domain/use-cases/add-audiobook-status'
import { IAddAudiobookValidate } from '../../../domain/use-cases/add-audiobook-validate'
import { IConvertFileValidate } from '../../../domain/use-cases/convert-file-validate'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'
import { AddAudiobookController } from './add-audiobook.controller'

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

const makeAddAudiobook = (): IAddAudiobook => {
  class AddAudiobookStub implements IAddAudiobook {
    async addAudiobook(audiobook: IAddAudiobookModel): Promise<IAudiobookWithLastStatusModel> {
      return await Promise.resolve({
        id: 'id',
        status: AudiobookStatus.PENDING,
        createdAt: new Date(),
        title: audiobook.title,
        description: audiobook.description,
        tags: audiobook.tags
      })
    }
  }
  return new AddAudiobookStub()
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

const makeAddAudiobookValidate = (): IAddAudiobookValidate => {
  class AddAudiobookValidateStub implements IAddAudiobookValidate {
    async validateAddAudiobook(_addAudiobook: IAddAudiobookModel): Promise<any> {
      return await Promise.resolve({})
    }
  }
  return new AddAudiobookValidateStub()
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
  addAudiobookValidate: IAddAudiobookValidate
  convertAudioFileValidate: IConvertFileValidate
  addAudiobook: IAddAudiobook
  addAudiobookStatus: IAddAudiobookStatus
  sut: AddAudiobookController
  httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IAddAudiobookModel, string>
} => {
  const emptyValidator = makeEmptyValidator()
  const accessTokenValidator = makeAccessTokenValidator()
  const addAudiobookValidate = makeAddAudiobookValidate()
  const convertAudioFileValidate = makeConvertAudioFileValidate()
  const addAudiobook = makeAddAudiobook()
  const addAudiobookStatus = makeAddAudiobookStatus()
  const sut = new AddAudiobookController(
    emptyValidator,
    accessTokenValidator,
    addAudiobookValidate,
    convertAudioFileValidate,
    addAudiobook,
    addAudiobookStatus
  )
  const httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IAddAudiobookModel, string> = {
    header: {
      authorization: 'token'
    },
    body: {
      title: 'title',
      description: 'description',
      tags: ['tags']
    },
    file: 'path/to/file.mp3'
  }

  return {
    emptyValidator,
    accessTokenValidator,
    addAudiobookValidate,
    convertAudioFileValidate,
    addAudiobook,
    addAudiobookStatus,
    sut,
    httpRequest
  }
}

describe('AddAudiobookController', () => {
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

  test('should return 400 if body or file is no provided', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    let httpResponse: IHttpResponse<any, any>

    jest.spyOn(emptyValidator, 'isEmpty')
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)

    httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toMatch(/Missing param.*body.*?/)

    jest.spyOn(emptyValidator, 'isEmpty')
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(true)

    httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toMatch(/Missing param.*file.*?/)
  })

  test('should return 400 with object validation error if body isn\'t valid', async () => {
    const { sut, addAudiobookValidate, httpRequest } = makeSut()
    jest.spyOn(addAudiobookValidate, 'validateAddAudiobook').mockResolvedValue({ foo: new Error() })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toMatch(/Object validation.*/)
  })

  test('should return 400 with invalid param error if file isn\'t valid', async () => {
    const { sut, convertAudioFileValidate, httpRequest } = makeSut()
    jest.spyOn(convertAudioFileValidate, 'validateConvertFile').mockResolvedValue(new Error('err'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toMatch(/err/)
  })

  test('should call IAddAudiobook', async () => {
    const { sut, addAudiobook, httpRequest } = makeSut()
    const addAudiobookSpy = jest.spyOn(addAudiobook, 'addAudiobook')
    await sut.handle(httpRequest)
    expect(addAudiobookSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 500 if IAddAudiobook throws', async () => {
    const { sut, addAudiobook, httpRequest } = makeSut()
    jest.spyOn(addAudiobook, 'addAudiobook').mockRejectedValue(new Error())
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body.message).toMatch(/Server error.*?/)
  })

  test('should call IAddAudiobookStatus', async () => {
    const { sut, addAudiobookStatus, httpRequest } = makeSut()
    const addAudiobookStatusSpy = jest.spyOn(addAudiobookStatus, 'addAudiobookStatus')
    await sut.handle(httpRequest)
    expect(addAudiobookStatusSpy).toHaveBeenCalled()
  })

  test('should return 500 if IAddAudiobookStatus throws', async () => {
    const { sut, addAudiobookStatus, httpRequest } = makeSut()
    jest.spyOn(addAudiobookStatus, 'addAudiobookStatus').mockRejectedValue(new Error())
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body.message).toMatch(/Server error.*?/)
  })

  test('should return 200 with audiofile data if success', async () => {
    const { sut, httpRequest } = makeSut()
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(200)
    expect(result.body.id).toBe('id')
    expect(result.body.status).toBe('pending')
    expect(result.body.createdAt).toBeTruthy()
    expect(result.body.title).toBe('title')
    expect(result.body.description).toBe('description')
    expect(result.body.tags[0]).toBe('tags')
  })
})
