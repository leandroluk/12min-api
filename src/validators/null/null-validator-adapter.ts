import { INullValidator } from '../../presentation/protocols/null-validator'

export class NullValidatorAdapter implements INullValidator {
  async isNull(value: any): Promise<boolean> {
    return await Promise.resolve([undefined, null].includes(value))
  }
}
