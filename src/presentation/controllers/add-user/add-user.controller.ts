import { IAddUser, IAddUserModel } from '../../../domain/use-cases/add-user'
import { IAddUserValidate } from '../../../domain/use-cases/add-user-validate'
import { MissingParamError } from '../../../errors/missing-param.error'
import { ObjectValidationError } from '../../../errors/object-validation.error'
import { badRequest, ok } from '../../helpers/http.helper'
import { IController } from '../../protocols/controller'
import { IHttpRequest, IHttpResponse } from '../../protocols/http'
import { INullValidator } from '../../protocols/null-validator'

export class AddUserController implements IController {
  constructor(
    readonly addUserRepository: IAddUser,
    readonly nullValidator: INullValidator,
    readonly addUserValidator: IAddUserValidate
  ) { }

  async handle(
    httpRequest: IHttpRequest<any, IAddUserModel>
  ): Promise<IHttpResponse<any, any>> {
    if (await this.nullValidator.isNull(httpRequest.body)) {
      return badRequest(new MissingParamError('body'))
    }

    const errors = await this.addUserValidator.validateAddUser(httpRequest.body)
    if (Object.keys(errors).length) {
      return badRequest(new ObjectValidationError(errors))
    }

    try {
      const user = await this.addUserRepository.addUser(httpRequest.body)
      return ok(user)
    } catch (error) {
      return badRequest(error)
    }
  }
}
