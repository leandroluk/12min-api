import { AudiobookStatus } from '../../../domain/models/audiobook.model'
import { IAuthenticatedHeaderModel } from '../../../domain/models/authenticated-header.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IAddAudiobook, IAddAudiobookModel } from '../../../domain/use-cases/add-audiobook'
import { IAddAudiobookStatus } from '../../../domain/use-cases/add-audiobook-status'
import { IAddAudiobookValidate } from '../../../domain/use-cases/add-audiobook-validate'
import { IConvertFileValidate } from '../../../domain/use-cases/convert-file-validate'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import { ObjectValidationError } from '../../../errors/object-validation/object-validation.error'
import { UnauthorizedError } from '../../errors/unauthorized.error'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http.helper'
import { IController } from '../../protocols/controller'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'

export class AddAudiobookController implements IController {
  constructor(
    readonly emptyValidator: IEmptyValidator,
    readonly accessTokenValidator: IAccessTokenValidate,
    readonly addAudiobookValidate: IAddAudiobookValidate,
    readonly convertFileValidate: IConvertFileValidate,
    readonly addAudiobook: IAddAudiobook,
    readonly addAudiobookStatus: IAddAudiobookStatus
  ) { }

  async handle(httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IAddAudiobookModel, string>): Promise<IHttpResponse<any, any>> {
    const { header, body, file } = httpRequest

    if (await this.emptyValidator.isEmpty(header.authorization)) {
      return unauthorized(new UnauthorizedError('accessToken is required.'))
    }

    if (!await this.accessTokenValidator.validateAccessToken(header.authorization)) {
      return unauthorized(new UnauthorizedError('accessToken is invalid or expired.'))
    }

    if (await this.emptyValidator.isEmpty(body)) {
      return badRequest(new MissingParamError('body'))
    }

    if (await this.emptyValidator.isEmpty(file)) {
      return badRequest(new MissingParamError('file'))
    }

    const [addAudiobookErrors, convertAudiobookErrors] = await Promise.all([
      this.addAudiobookValidate.validateAddAudiobook(body),
      this.convertFileValidate.validateConvertFile(file)
    ])

    if (Object.keys(addAudiobookErrors).length) {
      return badRequest(new ObjectValidationError(addAudiobookErrors))
    }

    if (convertAudiobookErrors) {
      return badRequest(convertAudiobookErrors)
    }

    try {
      const audiobook = await this.addAudiobook.addAudiobook(body)
      await this.addAudiobookStatus.addAudiobookStatus({
        audiobookId: audiobook.id,
        status: AudiobookStatus.PENDING,
        convertAudioFile: file
      })
      return ok({
        ...audiobook,
        status: AudiobookStatus.PENDING
      })
    } catch (error) {
      return serverError('fail when add audiobook')
    }
  }
}
