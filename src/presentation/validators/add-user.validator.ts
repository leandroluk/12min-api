import { IValidateUser, IValidateUserModel } from '@/domain/use-cases/validate-user'
import { isEmail, isNull, isPassword } from '@/helpers/type.helper'
import { InvalidParamError } from '@/presentation/errors/invalid-param.error'
import { MissingParamError } from '@/presentation/errors/missing-param.error'
import { ObjectValidationError } from '../errors/object-validation.error'

export class AddUserValidator implements IValidateUser {
  async validateUser(user: IValidateUserModel): Promise<any> {
    const errors: any = {}

    if (isNull(user.email)) {
      errors.email = new MissingParamError('email')
    } else {
      if (!isEmail(user.email)) {
        errors.email = new InvalidParamError('email')
      }
    }

    if (isNull(user.password)) {
      errors.password = new MissingParamError('password')
    } else {
      if (!isPassword(user.password)) {
        errors.password = new InvalidParamError('password', 'must be between 3 and 30 characters')
      }
    }

    return Object.keys(errors).length
      ? new ObjectValidationError(errors)
      : null
  }
}
