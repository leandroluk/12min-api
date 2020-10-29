import { IEncrypter } from '../../../data/protocols/encrypter'
import { IJwtToken } from '../../../data/protocols/jwt-token'
import { IAuthenticateUserModel } from '../../../domain/use-cases/authenticate-user'
import { IAuthenticateUserValidate } from '../../../domain/use-cases/authenticate-user-validate'
import { IGetUserByEmail } from '../../../domain/use-cases/get-user-by-email'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import { ObjectValidationError } from '../../../errors/object-validation/object-validation.error'
import { NotFoundError } from '../../errors/not-found.error'
import { UnauthorizedError } from '../../errors/unauthorized.error'
import { badRequest, notFound, ok, serverError, unauthorized } from '../../helpers/http.helper'
import { IController } from '../../protocols/controller'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'
import { INullValidator } from '../../protocols/null-validator'

export class AuthenticateUserController implements IController {
  constructor(
    readonly getUserRepository: IGetUserByEmail,
    readonly nullValidator: INullValidator,
    readonly authenticateUserValidator: IAuthenticateUserValidate,
    readonly encrypter: IEncrypter,
    readonly jwtToken: IJwtToken
  ) { }

  async handle(httpRequest: IHttpRequest<any, IAuthenticateUserModel>): Promise<IHttpResponse<any, any>> {
    if (await this.nullValidator.isNull(httpRequest.body)) {
      return badRequest(new MissingParamError('body'))
    }

    const errors = await this.authenticateUserValidator.validateAuthenticateUser(httpRequest.body)

    if (Object.keys(errors).length) {
      return badRequest(new ObjectValidationError(errors))
    }

    try {
      const user = await this.getUserRepository.getUserByEmail(httpRequest.body.email)

      if (await this.nullValidator.isNull(user)) {
        return notFound(new NotFoundError(`there is no user using email ${httpRequest.body.email}`))
      }

      if (await this.encrypter.compare(httpRequest.body.password, user.password)) {
        const token = await this.jwtToken.generate(user.id)
        return ok(token)
      }

      return unauthorized(new UnauthorizedError('invalid password'))
    } catch (error) {
      return serverError()
    }
  }
}
