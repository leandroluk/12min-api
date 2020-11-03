import { AudiobookStatus } from '../../../domain/models/audiobook.model'
import { IAuthenticatedHeaderModel } from '../../../domain/models/authenticated-header.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IAddAudiobookStatus } from '../../../domain/use-cases/add-audiobook-status'
import { IConvertFileValidate } from '../../../domain/use-cases/convert-file-validate'
import { IGetAudiobook } from '../../../domain/use-cases/get-audiobook'
import { IUpdateAudiobook, IUpdateAudiobookModel } from '../../../domain/use-cases/update-audiobook'
import { IUpdateAudiobookValidate } from '../../../domain/use-cases/update-audiobook-validate'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import { NoDataFoundError } from '../../../errors/no-data-found/no-data-found.error'
import { ObjectValidationError } from '../../../errors/object-validation/object-validation.error'
import { UnauthorizedError } from '../../errors/unauthorized.error'
import { badRequest, notFound, ok, serverError, unauthorized } from '../../helpers/http.helper'
import { IController } from '../../protocols/controller'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'

export class UpdateAudiobookController implements IController {
  constructor(
    readonly emptyValidator: IEmptyValidator,
    readonly accessTokenValidator: IAccessTokenValidate,
    readonly updateAudiobookValidate: IUpdateAudiobookValidate,
    readonly convertFileValidate: IConvertFileValidate,
    readonly getAudiobook: IGetAudiobook,
    readonly updateAudiobook: IUpdateAudiobook,
    readonly addAudiobookStatus: IAddAudiobookStatus
  ) { }

  async handle(httpRequest: IHttpRequest<IAuthenticatedHeaderModel, IUpdateAudiobookModel, string>): Promise<IHttpResponse<any, any>> {
    const { header, body, file, params } = httpRequest

    if (await this.emptyValidator.isEmpty(header.authorization)) {
      return unauthorized(new UnauthorizedError('accessToken is required.'))
    }

    if (!await this.accessTokenValidator.validateAccessToken(header.authorization)) {
      return unauthorized(new UnauthorizedError('accessToken is invalid or expired.'))
    }

    if (await this.emptyValidator.isEmpty(body)) {
      return badRequest(new MissingParamError('body'))
    }

    if (await this.emptyValidator.isEmpty(params.audiobookId)) {
      return badRequest(new MissingParamError('audiobookId'))
    }

    const updateAudiobookErrors = await this.updateAudiobookValidate.validateUpdateAudiobook(body)

    if (Object.keys(updateAudiobookErrors).length) {
      return badRequest(new ObjectValidationError(updateAudiobookErrors))
    }

    const hasFile = !await this.emptyValidator.isEmpty(file)

    if (hasFile) {
      const convertAudiobookErrors = await this.convertFileValidate.validateConvertFile(file)
      if (convertAudiobookErrors) {
        return badRequest(convertAudiobookErrors)
      }
    }

    try {
      const oldAudiobook = await this.getAudiobook.getAudiobook(params.audiobookId)

      if (!oldAudiobook) {
        return notFound(new NoDataFoundError(`could not find any audiobook with id '${params.audiobookId}'`))
      }

      const updatedAudiobook = await this.updateAudiobook.updateAudiobook(oldAudiobook.id, body)

      if (hasFile) {
        await this.addAudiobookStatus.addAudiobookStatus({
          audiobookId: oldAudiobook.id,
          status: AudiobookStatus.PENDING,
          convertAudioFile: file
        })
        updatedAudiobook.status = AudiobookStatus.PENDING
      }

      return ok(updatedAudiobook)
    } catch (error) {
      if (error.constructor.name === 'InvalidParamError' && error.message.includes('audiobookId')) {
        return notFound(new NoDataFoundError(`could not find any audiobook with id '${params.audiobookId}'`))
      }
      return serverError('fail when add audiobook')
    }
  }
}
