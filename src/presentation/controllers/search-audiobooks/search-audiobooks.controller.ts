import { IAccessTokenValidate } from '../../../domain/use-cases/access-token-validate'
import { ISearchAudiobooks, ISearchAudiobooksQuery } from '../../../domain/use-cases/search-audiobooks'
import { ISearchAudiobooksParse } from '../../../domain/use-cases/search-audiobooks-parse'
import { ISearchAudiobooksValidate } from '../../../domain/use-cases/search-audiobooks-validate'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { NoDataFoundError } from '../../../errors/no-data-found/no-data-found.error'
import { ObjectValidationError } from '../../../errors/object-validation/object-validation.error'
import { UnauthorizedError } from '../../errors/unauthorized.error'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http.helper'
import { IController } from '../../protocols/controller'
import { IEmptyValidator } from '../../protocols/empty-validator'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'
import { INullValidator } from '../../protocols/null-validator'

export class SearchAudiobooksController implements IController {
  constructor(
    readonly nullValidator: INullValidator,
    readonly emptyValidator: IEmptyValidator,
    readonly accessTokenValidator: IAccessTokenValidate,
    readonly searchAudiobooksValidate: ISearchAudiobooksValidate,
    readonly searchAudiobookxParse: ISearchAudiobooksParse,
    readonly searchAudiobooks: ISearchAudiobooks
  ) { }

  async handle(httpRequest: IHttpRequest<any, any, any, any, ISearchAudiobooksQuery>): Promise<IHttpResponse> {
    const { header, query } = httpRequest

    if (await this.emptyValidator.isEmpty(header.authorization)) {
      return unauthorized(new UnauthorizedError('accessToken is required.'))
    }

    if (!await this.accessTokenValidator.validateAccessToken(header.authorization)) {
      return unauthorized(new UnauthorizedError('accessToken is invalid or expired.'))
    }

    if (await this.nullValidator.isNull(query)) {
      return badRequest(new InvalidParamError('query', 'must be a dict with search fields'))
    }

    const queryErrors = await this.searchAudiobooksValidate.validateSearchAudiobooks(query)

    if (Object.keys(queryErrors).length) {
      return badRequest(new ObjectValidationError(queryErrors))
    }

    const parsedQuery = await this.searchAudiobookxParse.parseSearchAudiobooks(query)

    try {
      const result = await this.searchAudiobooks.searchAudiobooks(parsedQuery)
      return ok(result)
    } catch (error) {
      if (error.constructor.name === 'InvalidParamError') {
        return badRequest(new NoDataFoundError('no record could be found using the criteria'))
      }
      return serverError()
    }
  }
}
