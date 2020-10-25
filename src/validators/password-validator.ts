import { IPasswordValidator } from '@/presentation/protocols/password-validator'

export class PasswordValidator implements IPasswordValidator {
  async isPassword(value: any): Promise<boolean> {
    return await Promise.resolve(
      typeof value === 'string' &&
      value.length >= 3 && value.length <= 30
    )
  }
}
