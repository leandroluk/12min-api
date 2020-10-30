import { AudiobookStatus, IAudiobookModel } from '../../../domain/models/audiobook.model'
import { IAuthenticatedHeaderModel } from '../../../domain/models/authenticated-header.model'
import { ILogConvertAudioFileModel } from '../../../domain/models/log-convert-audio-file.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IAddAudiobook, IAddAudiobookModel } from '../../../domain/use-cases/add-audiobook'
import { IAddAudiobookValidate } from '../../../domain/use-cases/add-audiobook-validate'
import { IConvertAudioFileValidate } from '../../../domain/use-cases/convert-audio-file-validate'
import { ILogConvertAudioFile } from '../../../domain/use-cases/log-convert-audio-file'
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
    async isEmpty(_value: any): Promise<any> {
      return await Promise.resolve(false)
    }
  }
  return new EmptyValidatorStub()
}

const makeAddAudiobook = (): IAddAudiobook => {
  class AddAudiobookStub implements IAddAudiobook {
    async addAudiobook(audiobook: IAddAudiobookModel): Promise<IAudiobookModel> {
      return await Promise.resolve({
        id: 'id',
        status: AudiobookStatus.PENDING,
        createdAt: new Date(),
        ...audiobook
      })
    }
  }
  return new AddAudiobookStub()
}

const makeLogConvertAudioFile = (): ILogConvertAudioFile => {
  class LogConvertAudioFileStub implements ILogConvertAudioFile {
    async logConvertAudioFile(audiobook: IAudiobookModel, convertAudioFile: string): Promise<ILogConvertAudioFileModel> {
      return await Promise.resolve({
        id: 'id',
        audiobookId: audiobook.id,
        convertAudioFile,
        status: 'some status'
      })
    }
  }
  return new LogConvertAudioFileStub()
}

const makeAddAudiobookValidate = (): IAddAudiobookValidate => {
  class AddAudiobookValidateStub implements IAddAudiobookValidate {
    async validateAddAudiobook(_addAudiobook: IAddAudiobookModel): Promise<any> {
      return await Promise.resolve({})
    }
  }
  return new AddAudiobookValidateStub()
}

const makeConvertAudioFileValidate = (): IConvertAudioFileValidate => {
  class ConvertAudioFileValidateStub implements IConvertAudioFileValidate {
    async validateConvertAudioFile(_convertAudioFile: string): Promise<Error> {
      return await Promise.resolve(null)
    }
  }
  return new ConvertAudioFileValidateStub()
}

const makeSut = (): {
  emptyValidator: IEmptyValidator
  accessTokenValidator: IAccessTokenValidate
  addAudiobookValidate: IAddAudiobookValidate
  convertAudioFileValidate: IConvertAudioFileValidate
  addAudiobookRepository: IAddAudiobook
  logConvertAudioFileRepository: ILogConvertAudioFile
  sut: AddAudiobookController
  httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IAddAudiobookModel, string>
} => {
  const emptyValidator = makeEmptyValidator()
  const accessTokenValidator = makeAccessTokenValidator()
  const addAudiobookValidate = makeAddAudiobookValidate()
  const convertAudioFileValidate = makeConvertAudioFileValidate()
  const addAudiobookRepository = makeAddAudiobook()
  const logConvertAudioFileRepository = makeLogConvertAudioFile()
  const sut = new AddAudiobookController(
    emptyValidator,
    accessTokenValidator,
    addAudiobookValidate,
    convertAudioFileValidate,
    addAudiobookRepository,
    logConvertAudioFileRepository
  )
  const httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IAddAudiobookModel, string> = {
    header: {
      accessToken: 'token'
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
    addAudiobookRepository,
    logConvertAudioFileRepository,
    sut,
    httpRequest
  }
}

describe('AddAudiobookController', () => {
  test('should IEmptyValidator to be called', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    const isEmptySpy = jest.spyOn(emptyValidator, 'isEmpty')
    await sut.handle(httpRequest)
    expect(isEmptySpy).toBeCalled()
  })

  test('should return 401 if no access token is provided on header', async () => {
    const { sut, emptyValidator, httpRequest } = makeSut()
    jest.spyOn(emptyValidator, 'isEmpty').mockResolvedValue(true)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.message).toMatch(/Missing param.*accessToken.*?/)
  })

  test('should IAccessTokenValidate to be called', async () => {
    const { sut, accessTokenValidator, httpRequest } = makeSut()
    const validateAccessTokenSpy = jest.spyOn(accessTokenValidator, 'validateAccessToken')
    await sut.handle(httpRequest)
    expect(validateAccessTokenSpy).toBeCalled()
  })

  test('should return 401 if access token is invalid or expired', async () => {
    const { sut, accessTokenValidator, httpRequest } = makeSut()
    jest.spyOn(accessTokenValidator, 'validateAccessToken').mockResolvedValue(false)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body.message).toMatch(/Invalid param.*accessToken.*?/)
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
    jest.spyOn(convertAudioFileValidate, 'validateConvertAudioFile').mockResolvedValue(new Error('err'))
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.message).toMatch(/err/)
  })

  test('should call IAddAudiobook', async () => {
    const { sut, addAudiobookRepository, httpRequest } = makeSut()
    const addAudiobookSpy = jest.spyOn(addAudiobookRepository, 'addAudiobook')
    await sut.handle(httpRequest)
    expect(addAudiobookSpy).toBeCalledWith(httpRequest.body)
  })

  test('should return 500 if audiobookRepository throws', async () => {
    const { sut, addAudiobookRepository, httpRequest } = makeSut()
    jest.spyOn(addAudiobookRepository, 'addAudiobook').mockRejectedValue(new Error())
    const result = await sut.handle(httpRequest)
    expect(result.statusCode).toBe(500)
    expect(result.body.message).toMatch(/Server error.*/)
  })
})
