import { INullValidator } from '@/presentation/protocols/null-validator'

export class NullValidator implements INullValidator {
  async isNull(value: any): Promise<boolean> {
    return await Promise.resolve([undefined, null].includes(value))
  }
}
