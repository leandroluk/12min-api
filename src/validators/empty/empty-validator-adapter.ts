import { IEmptyValidator } from '../../presentation/protocols/empty-validator'

export class EmptyValidatorAdapter implements IEmptyValidator {
  async isEmpty(value: any): Promise<any> {
    return await Promise.resolve(
      [undefined, null, ''].includes(value) ||
      (typeof value === 'object' && !Object.keys(value).length) ||
      (value instanceof Array && !value.length)
    )
  }
}
