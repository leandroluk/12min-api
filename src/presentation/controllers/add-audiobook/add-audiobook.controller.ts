import { IAuthenticatedHeaderModel } from '../../../domain/models/authenticated-header.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IAddAudiobook, IAddAudiobookModel } from '../../../domain/use-cases/add-audiobook'
import { IAddAudiobookValidate } from '../../../domain/use-cases/add-audiobook-validate'
import { IConvertAudioFileValidate } from '../../../domain/use-cases/convert-audio-file-validate'
import { ILogConvertAudioFile } from '../../../domain/use-cases/log-convert-audio-file'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import { ObjectValidationError } from '../../../errors/object-validation/object-validation.error'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http.helper'
import { IController } from '../../protocols/controller'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'

export class AddAudiobookController implements IController {
  constructor(
    readonly emptyValidator: IEmptyValidator,
    readonly accessTokenValidator: IAccessTokenValidate,
    readonly addAudiobookValidate: IAddAudiobookValidate,
    readonly convertAudioFileValidate: IConvertAudioFileValidate,
    readonly addAudiobookRepository: IAddAudiobook,
    readonly logConvertAudioFileRepository: ILogConvertAudioFile
  ) { }

  async handle(httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IAddAudiobookModel, string>): Promise<IHttpResponse<any, any>> {
    const { header: { accessToken }, body, file } = httpRequest

    if (await this.emptyValidator.isEmpty(accessToken)) {
      return unauthorized(new MissingParamError('accessToken'))
    }

    if (!await this.accessTokenValidator.validateAccessToken(accessToken)) {
      return unauthorized(new InvalidParamError('accessToken', 'is invalid or expired.'))
    }

    if (await this.emptyValidator.isEmpty(body)) {
      return badRequest(new MissingParamError('body'))
    }

    if (await this.emptyValidator.isEmpty(file)) {
      return badRequest(new MissingParamError('file'))
    }

    const addAudiobookErrors = await this.addAudiobookValidate.validateAddAudiobook(body)

    if (Object.keys(addAudiobookErrors).length) {
      return badRequest(new ObjectValidationError(addAudiobookErrors))
    }

    const convertAudioFileError = await this.convertAudioFileValidate.validateConvertAudioFile(file)

    if (convertAudioFileError) {
      return badRequest(convertAudioFileError)
    }

    try {
      const audiobook = await this.addAudiobookRepository.addAudiobook(body)
      await this.logConvertAudioFileRepository.logConvertAudioFile(audiobook, file)
      return ok(audiobook)
    } catch (error) {
      return serverError('fail when add audiobook')
    }
  }
}
