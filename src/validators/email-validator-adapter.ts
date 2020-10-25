import { IEmailValidator } from '@/presentation/protocols/email-validator'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidator {
  async isEmail(value: any): Promise<boolean> {
    return await new Promise(resolve => {
      try {
        resolve(
          ![undefined, null, ''].includes(value) &&
          typeof value === 'string' &&
          validator.isEmail(value)
        )
      } catch (error) {
        resolve(false)
      }
    })
  }
}
