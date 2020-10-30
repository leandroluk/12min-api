import { IAddAudiobookModel } from '../../../domain/use-cases/add-audiobook'
import { IAddAudiobookValidate } from '../../../domain/use-cases/add-audiobook-validate'
import { InvalidParamError } from '../../../errors/invalid-param/invalid-param.error'
import { MissingParamError } from '../../../errors/missing-param/missing-param.error'
import { INullValidator } from '../../protocols/null-validator'

export class AddAudiobookValidator implements IAddAudiobookValidate {
  constructor(
    readonly nullValidator: INullValidator
  ) { }

  async validateAddAudiobook(addAudiobook: IAddAudiobookModel): Promise<any> {
    const errors = {} as any

    if (await this.nullValidator.isNull(addAudiobook.title)) {
      errors.title = new MissingParamError('title')
    } else {
      if (typeof addAudiobook.title !== 'string') {
        errors.title = new InvalidParamError('title', 'must be a string.')
      }
    }

    if (await this.nullValidator.isNull(addAudiobook.description)) {
      errors.description = new MissingParamError('description')
    } else {
      if (typeof addAudiobook.description !== 'string') {
        errors.description = new InvalidParamError('description', 'must be a string.')
      }
    }

    if (await this.nullValidator.isNull(addAudiobook.tags)) {
      errors.tags = new MissingParamError('tags')
    } else {
      if (
        !(addAudiobook.tags instanceof Array) ||
        addAudiobook.tags.some(tag => typeof tag !== 'string')
      ) {
        errors.tags = new InvalidParamError('tags', 'must be a array of strings')
      }
    }

    return errors
  }
}
