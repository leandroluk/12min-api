import { IAddUserValidate, IAddUserValidateModel } from '@/domain/use-cases/add-user-validate'
import { InvalidParamError } from '@/errors/invalid-param.error'
import { MissingParamError } from '@/errors/missing-param.error'
import { ObjectValidationError } from '@/errors/object-validation.error'
import { isEmail, isNull, isPassword } from '@/helpers/type.helper'

export class AddUserValidator implements IAddUserValidate {
  async validateAddUser(user: IAddUserValidateModel): Promise<any> {
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

    if (Object.keys(errors).length) {
      return new ObjectValidationError(errors)
    }

    return null
  }
}
