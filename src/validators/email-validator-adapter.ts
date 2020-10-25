import { IEmailValidator } from '@/presentation/protocols/email-validator'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidator {
  async isEmail(value: any): Promise<boolean> {
    let valid = (
      ![undefined, null, ''].includes(value) &&
      typeof value === 'string'
    )

    try {
      if (valid) {
        valid = validator.isEmail(value)
      }
    } catch (error) {
      valid = false
    }

    return await Promise.resolve(valid)
  }
}
