import { IAddUserModel } from '../../../domain/use-cases/add-user'
import { IAddUserValidate } from '../../../domain/use-cases/add-user-validate'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import { IEmailValidator } from '../../protocols/email-validator'
import { INullValidator } from '../../protocols/null-validator'
import { IPasswordValidator } from '../../protocols/password-validator'

export class AddUserValidator implements IAddUserValidate {
  constructor(
    readonly nullValidator: INullValidator,
    readonly emailValidator: IEmailValidator,
    readonly passwordValidator: IPasswordValidator
  ) {
  }

  async validateAddUser(user: IAddUserModel): Promise<any> {
    const errors: any = {}

    if (await this.nullValidator.isNull(user.email)) {
      errors.email = new MissingParamError('email')
    } else {
      if (!await this.emailValidator.isEmail(user.email)) {
        errors.email = new InvalidParamError('email')
      }
    }

    if (await this.nullValidator.isNull(user.password)) {
      errors.password = new MissingParamError('password')
    } else {
      if (!await this.passwordValidator.isPassword(user.password)) {
        errors.password = new InvalidParamError('password', 'must be between 3 and 30 characters')
      }
    }

    return errors
  }
}
