import { IAuthenticatedHeaderModel } from '../../../domain/models/authenticated-header.model'
import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { IRemoveAudiobook, IRemoveAudiobookParams } from '../../../domain/use-cases/remove-audiobook'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import { NoDataFoundError } from '../../../errors/no-data-found/no-data-found.error'
import { UnauthorizedError } from '../../errors/unauthorized.error'
import { badRequest, notFound, ok, serverError, unauthorized } from '../../helpers/http.helper'
import { IController } from '../../protocols/controller'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'

export class RemoveAudiobookController implements IController {
  constructor(
    readonly emptyValidator: IEmptyValidator,
    readonly accessTokenValidator: IAccessTokenValidate,
    readonly removeAudiobook: IRemoveAudiobook
  ) { }

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const {
      header = {} as IAuthenticatedHeaderModel,
      params = {} as IRemoveAudiobookParams
    } = httpRequest

    const [accessTokenEmpty, accessTokenValid] = await Promise.all([
      this.emptyValidator.isEmpty(header.authorization),
      this.accessTokenValidator.validateAccessToken(header.authorization)
    ])

    if (accessTokenEmpty || !accessTokenValid) {
      return unauthorized(new UnauthorizedError('accessToken is invalid or expired.'))
    }

    if (await this.emptyValidator.isEmpty(params.audiobookId)) {
      return badRequest(new MissingParamError('audiobookId'))
    }

    try {
      const audiobook = await this.removeAudiobook.removeAudiobook(params.audiobookId)

      if (!audiobook) {
        return notFound(new NoDataFoundError(`could not find any audiobook with id '${params.audiobookId}'`))
      }

      return ok()
    } catch (error) {
      if (
        error.constructor.name === 'InvalidParamError' &&
        error.message.includes('audiobookId')
      ) return notFound(new NoDataFoundError(`could not find any audiobook with id '${params.audiobookId}'`))
      return serverError('cannot get audiobook.')
    }
  }
}
