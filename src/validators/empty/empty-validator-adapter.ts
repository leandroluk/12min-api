import { IEmptyValidator } from '../../presentation/protocols/empty-validator'

export class EmptyValidatorAdapter implements IEmptyValidator {
  async isEmpty(value: any): Promise<boolean> {
    return await new Promise(resolve => {
      try {
        resolve(
          [undefined, null, ''].includes(value) ||
          (value instanceof Array && value.length === 0) ||
          (typeof value === 'object' && Object.keys(value).length === 0)
        )
      } catch (error) {
        resolve(false)
      }
    })
  }
}
