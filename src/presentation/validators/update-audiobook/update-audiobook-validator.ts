import { IUpdateAudiobookModel } from '../../../domain/use-cases/update-audiobook'
import { IUpdateAudiobookValidate } from '../../../domain/use-cases/update-audiobook-validate'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { INullValidator } from '../../protocols/null-validator'

export class UpdateAudiobookValidator implements IUpdateAudiobookValidate {
  constructor(
    readonly nullValidator: INullValidator
  ) { }

  async validateUpdateAudiobook(updateAudiobook: IUpdateAudiobookModel): Promise<any> {
    const errors = {} as any

    if (!await this.nullValidator.isNull(updateAudiobook.title)) {
      if (typeof updateAudiobook.title !== 'string') {
        errors.title = new InvalidParamError('title', 'must be a string')
      }
    }

    if (!await this.nullValidator.isNull(updateAudiobook.description)) {
      if (typeof updateAudiobook.description !== 'string') {
        errors.description = new InvalidParamError('description', 'must be a string')
      }
    }

    if (!await this.nullValidator.isNull(updateAudiobook.tags)) {
      if (
        !(updateAudiobook.tags instanceof Array) ||
        updateAudiobook.tags.some(tag => typeof tag !== 'string')
      ) {
        errors.tags = new InvalidParamError('tags', 'must be a array of strings')
      }
    }

    return errors
  }
}
